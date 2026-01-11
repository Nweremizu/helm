import { prisma } from "@/prisma/db";
import type { SpendingCategory, DailySpendingPoint } from "./types";
import { koboToNaira, CATEGORY_ICONS } from "./types";

export async function getMonthlySpendingBreakdown(
  userId: string,
  date: Date = new Date()
): Promise<SpendingCategory[]> {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

  const breakdown = await prisma.transaction.groupBy({
    by: ["cleanCategory"],
    where: {
      userId,
      type: "DEBIT",
      date: { gte: start, lte: end },
    },
    _sum: { amount: true },
    _count: { id: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  const totalExpense = breakdown.reduce(
    (sum, item) => sum + (item._sum.amount || 0),
    0
  );

  return breakdown.map((item) => {
    const category = item.cleanCategory || "Uncategorized";
    const amountKobo = item._sum.amount || 0;

    return {
      category,
      amountKobo,
      amountNaira: koboToNaira(amountKobo),
      percentage: totalExpense > 0 ? (amountKobo / totalExpense) * 100 : 0,
      icon: CATEGORY_ICONS[category] || "circle-help",
      transactionCount: item._count.id,
    };
  });
}

export async function getDailySpending(
  userId: string,
  days: number = 30
): Promise<DailySpendingPoint[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: startDate },
    },
    select: {
      date: true,
      amount: true,
      type: true,
    },
    orderBy: { date: "asc" },
  });

  const dailyMap = new Map<string, { income: number; expense: number }>();

  for (const tx of transactions) {
    const dateKey = tx.date.toISOString().split("T")[0];
    const current = dailyMap.get(dateKey) || { income: 0, expense: 0 };

    if (tx.type === "CREDIT") {
      current.income += tx.amount;
    } else {
      current.expense += tx.amount;
    }

    dailyMap.set(dateKey, current);
  }

  return Array.from(dailyMap.entries()).map(([date, data]) => ({
    date,
    incomeKobo: data.income,
    expenseKobo: data.expense,
    netKobo: data.income - data.expense,
  }));
}

export async function getAverageDailySpend(
  userId: string,
  days: number = 30
): Promise<number> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const result = await prisma.transaction.aggregate({
    where: {
      userId,
      type: "DEBIT",
      date: { gte: startDate },
    },
    _sum: { amount: true },
  });

  const totalSpent = result._sum.amount || 0;
  return Math.round(totalSpent / days);
}
