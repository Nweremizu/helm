import { prisma } from "@/prisma/db";
import type { RecurringTransaction } from "./types";

const RECURRING_KEYWORDS = [
  { keyword: "NETFLIX", name: "Netflix", category: "Subscription" },
  { keyword: "SPOTIFY", name: "Spotify", category: "Subscription" },
  { keyword: "DSTV", name: "DStv", category: "Subscription" },
  { keyword: "GOTV", name: "GOtv", category: "Subscription" },
  { keyword: "SHOWMAX", name: "Showmax", category: "Subscription" },
  { keyword: "AMAZON PRIME", name: "Amazon Prime", category: "Subscription" },
  { keyword: "APPLE.COM", name: "Apple", category: "Subscription" },
  {
    keyword: "YOUTUBE PREMIUM",
    name: "YouTube Premium",
    category: "Subscription",
  },
  { keyword: "DISNEY", name: "Disney+", category: "Subscription" },
  { keyword: "HBO", name: "HBO Max", category: "Subscription" },
  { keyword: "ELECTRICITY", name: "Electricity Bill", category: "Utilities" },
  { keyword: "EKEDC", name: "Eko Electricity", category: "Utilities" },
  { keyword: "IKEDC", name: "Ikeja Electric", category: "Utilities" },
  { keyword: "AEDC", name: "Abuja Electric", category: "Utilities" },
  { keyword: "PHEDC", name: "Port Harcourt Electric", category: "Utilities" },
  { keyword: "KEDCO", name: "Kano Electric", category: "Utilities" },
  { keyword: "MTN", name: "MTN Airtime/Data", category: "Utilities" },
  { keyword: "AIRTEL", name: "Airtel Airtime/Data", category: "Utilities" },
  { keyword: "GLO", name: "Glo Airtime/Data", category: "Utilities" },
  { keyword: "9MOBILE", name: "9Mobile", category: "Utilities" },
  { keyword: "SPECTRANET", name: "Spectranet Internet", category: "Utilities" },
  { keyword: "SMILE", name: "Smile Internet", category: "Utilities" },
  { keyword: "IPNX", name: "ipNX Internet", category: "Utilities" },
  { keyword: "SWIFT", name: "Swift Network", category: "Utilities" },
  { keyword: "GYM", name: "Gym Membership", category: "Health" },
  { keyword: "FITNESS", name: "Fitness Subscription", category: "Health" },
];

export async function detectRecurringTransactions(
  userId: string
): Promise<RecurringTransaction[]> {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: "DEBIT",
      date: { gte: threeMonthsAgo },
    },
    orderBy: { date: "desc" },
  });

  const recurring: RecurringTransaction[] = [];
  const processedKeywords = new Set<string>();

  for (const tx of transactions) {
    const narrationUpper = tx.originalNarration.toUpperCase();

    for (const rule of RECURRING_KEYWORDS) {
      if (
        narrationUpper.includes(rule.keyword) &&
        !processedKeywords.has(rule.keyword)
      ) {
        const matchingTxs = transactions.filter((t) =>
          t.originalNarration.toUpperCase().includes(rule.keyword)
        );

        if (matchingTxs.length >= 2) {
          const frequency = detectFrequency(matchingTxs.map((t) => t.date));
          const avgAmount = Math.round(
            matchingTxs.reduce((sum, t) => sum + t.amount, 0) /
              matchingTxs.length
          );

          recurring.push({
            id: tx.id,
            name: tx.cleanName || rule.name,
            amountKobo: avgAmount,
            category: rule.category,
            frequency,
            nextDueDate: predictNextDueDate(matchingTxs[0].date, frequency),
            confidence: Math.min(0.9, 0.5 + matchingTxs.length * 0.1),
          });

          processedKeywords.add(rule.keyword);
        }
      }
    }
  }

  return recurring.sort(
    (a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime()
  );
}

function detectFrequency(dates: Date[]): "weekly" | "monthly" | "yearly" {
  if (dates.length < 2) return "monthly";

  const sorted = dates.sort((a, b) => b.getTime() - a.getTime());
  const gaps: number[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const diffDays = Math.round(
      (sorted[i].getTime() - sorted[i + 1].getTime()) / (1000 * 60 * 60 * 24)
    );
    gaps.push(diffDays);
  }

  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;

  if (avgGap <= 10) return "weekly";
  if (avgGap <= 45) return "monthly";
  return "yearly";
}

function predictNextDueDate(
  lastDate: Date,
  frequency: "weekly" | "monthly" | "yearly"
): Date {
  const next = new Date(lastDate);

  switch (frequency) {
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "yearly":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }

  while (next < new Date()) {
    switch (frequency) {
      case "weekly":
        next.setDate(next.getDate() + 7);
        break;
      case "monthly":
        next.setMonth(next.getMonth() + 1);
        break;
      case "yearly":
        next.setFullYear(next.getFullYear() + 1);
        break;
    }
  }

  return next;
}

export async function getUpcomingBillsTotal(
  userId: string,
  daysAhead: number = 30
): Promise<number> {
  const recurring = await detectRecurringTransactions(userId);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

  return recurring
    .filter((r) => r.nextDueDate <= cutoffDate)
    .reduce((sum, r) => sum + r.amountKobo, 0);
}
