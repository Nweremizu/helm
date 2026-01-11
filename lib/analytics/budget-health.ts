import { prisma } from "@/prisma/db";

export type HealthStatus = "safe" | "warning" | "breached";
export type SpendingTrend = "on_track" | "spending_fast" | "under_budget";

export interface CategoryHealth {
  category: string;
  budgetedKobo: number;
  spentKobo: number;
  remainingKobo: number;
  percentage: number;
  status: HealthStatus;
  trend: SpendingTrend;
  type: "ANCHOR" | "VARIABLE";
  icon: string | null;
  color: string | null;
}

export interface UnbudgetedSpending {
  category: string;
  spentKobo: number;
  transactionCount: number;
}

export interface BudgetHealth {
  categories: CategoryHealth[];
  unbudgeted: UnbudgetedSpending[];
  summary: {
    totalBudgetedKobo: number;
    totalSpentKobo: number;
    totalRemainingKobo: number;
    overallPercentage: number;
    overallStatus: HealthStatus;
  };
}

function getHealthStatus(percentage: number): HealthStatus {
  if (percentage >= 100) return "breached";
  if (percentage >= 80) return "warning";
  return "safe";
}

function getSpendingTrend(
  percentage: number,
  dayOfMonth: number,
  daysInMonth: number
): SpendingTrend {
  const expectedPercentage = (dayOfMonth / daysInMonth) * 100;

  if (percentage > expectedPercentage + 15) return "spending_fast";
  if (percentage < expectedPercentage - 15) return "under_budget";
  return "on_track";
}

export async function getBudgetHealth(userId: string): Promise<BudgetHealth> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const dayOfMonth = now.getDate();
  const daysInMonth = endOfMonth.getDate();

  const [budgetPlans, spendingByCategory] = await Promise.all([
    prisma.budgetPlan.findMany({
      where: { userId },
    }),
    prisma.transaction.groupBy({
      by: ["cleanCategory"],
      where: {
        userId,
        type: "DEBIT",
        date: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { amount: true },
      _count: { id: true },
    }),
  ]);

  const spendingMap = new Map(
    spendingByCategory.map((s) => [
      s.cleanCategory || "Uncategorized",
      { amount: s._sum.amount || 0, count: s._count.id },
    ])
  );

  const budgetedCategories = new Set(budgetPlans.map((p) => p.category));

  const categories: CategoryHealth[] = budgetPlans.map((plan) => {
    const budgetedKobo = Math.round(Number(plan.limitAmount) * 100);
    const spending = spendingMap.get(plan.category);
    const spentKobo = spending?.amount || 0;
    const remainingKobo = Math.max(0, budgetedKobo - spentKobo);
    const percentage = budgetedKobo > 0 ? (spentKobo / budgetedKobo) * 100 : 0;

    return {
      category: plan.category,
      budgetedKobo,
      spentKobo,
      remainingKobo,
      percentage: Math.round(percentage * 10) / 10,
      status: getHealthStatus(percentage),
      trend: getSpendingTrend(percentage, dayOfMonth, daysInMonth),
      type: plan.type as "ANCHOR" | "VARIABLE",
      icon: plan.icon,
      color: plan.color,
    };
  });

  const unbudgeted: UnbudgetedSpending[] = [];
  for (const [category, spending] of spendingMap) {
    if (!budgetedCategories.has(category)) {
      unbudgeted.push({
        category,
        spentKobo: spending.amount,
        transactionCount: spending.count,
      });
    }
  }

  const totalBudgetedKobo = categories.reduce((s, c) => s + c.budgetedKobo, 0);
  const totalSpentKobo = categories.reduce((s, c) => s + c.spentKobo, 0);
  const totalRemainingKobo = Math.max(0, totalBudgetedKobo - totalSpentKobo);
  const overallPercentage =
    totalBudgetedKobo > 0 ? (totalSpentKobo / totalBudgetedKobo) * 100 : 0;

  return {
    categories: categories.sort((a, b) => b.percentage - a.percentage),
    unbudgeted: unbudgeted.sort((a, b) => b.spentKobo - a.spentKobo),
    summary: {
      totalBudgetedKobo,
      totalSpentKobo,
      totalRemainingKobo,
      overallPercentage: Math.round(overallPercentage * 10) / 10,
      overallStatus: getHealthStatus(overallPercentage),
    },
  };
}
