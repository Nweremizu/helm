import { prisma } from "@/prisma/db";
import type { InsightType } from "@/app/generated/prisma/enums";
import { formatNaira } from "@/lib/analytics/types";

const MIN_BASELINE_KOBO = 100_000; // ₦1,000
const MIN_INCREASE_KOBO = 50_000; // ₦500
const WARNING_THRESHOLD = 0.2; // 20%
const CRITICAL_THRESHOLD = 0.5; // 50%

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfTomorrow(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}

function startOfPrevMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

function endOfPrevMonthWindow(now: Date) {
  const startCurrent = startOfMonth(now);
  const prevWindowEnd = startOfTomorrow(
    new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  );

  return prevWindowEnd > startCurrent ? startCurrent : prevWindowEnd;
}

function normalizeCategory(category: string) {
  return category.trim();
}

function shouldIgnoreCategory(category: string) {
  const c = category.toLowerCase();
  return c === "income" || c === "transfer" || c === "uncategorized";
}

export async function ensureOverspendingTrendInsights(
  userId: string
): Promise<void> {
  const now = new Date();

  const currentStart = startOfMonth(now);
  const currentEndExclusive = startOfTomorrow(now);

  const prevStart = startOfPrevMonth(now);
  const prevEndExclusive = endOfPrevMonthWindow(now);

  const existingThisMonth = await prisma.insight.findMany({
    where: {
      userId,
      type: "TREND" as InsightType,
      createdAt: { gte: currentStart },
      archivedAt: null,
    },
    select: { title: true },
  });

  const existingTitles = new Set(existingThisMonth.map((i) => i.title));

  const [current, previous] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["cleanCategory"],
      where: {
        userId,
        type: "DEBIT",
        date: { gte: currentStart, lt: currentEndExclusive },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.groupBy({
      by: ["cleanCategory"],
      where: {
        userId,
        type: "DEBIT",
        date: { gte: prevStart, lt: prevEndExclusive },
      },
      _sum: { amount: true },
    }),
  ]);

  const prevMap = new Map<string, number>();
  for (const row of previous) {
    const category = normalizeCategory(row.cleanCategory || "Uncategorized");
    prevMap.set(category, row._sum.amount || 0);
  }

  for (const row of current) {
    const category = normalizeCategory(row.cleanCategory || "Uncategorized");
    if (shouldIgnoreCategory(category)) continue;

    const currentKobo = row._sum.amount || 0;
    const prevKobo = prevMap.get(category) || 0;

    if (prevKobo < MIN_BASELINE_KOBO) continue;
    if (currentKobo <= prevKobo) continue;

    const increaseKobo = currentKobo - prevKobo;
    if (increaseKobo < MIN_INCREASE_KOBO) continue;

    const increasePct = increaseKobo / prevKobo;
    if (increasePct < WARNING_THRESHOLD) continue;

    const pctRounded = Math.round(increasePct * 100);
    const title = `Spending up: ${category}`;
    if (existingTitles.has(title)) continue;

    const severity = increasePct >= CRITICAL_THRESHOLD ? "critical" : "warning";

    await prisma.insight.create({
      data: {
        userId,
        type: "TREND" as InsightType,
        title,
        message: `You spent ${pctRounded}% more on ${category} this month (${formatNaira(
          currentKobo
        )} vs ${formatNaira(prevKobo)} last month-to-date).`,
        severity,
      },
    });

    existingTitles.add(title);
  }
}
