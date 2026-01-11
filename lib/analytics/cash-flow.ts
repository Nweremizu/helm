import { prisma } from "@/prisma/db";

export interface CategoryCashFlow {
  category: string;
  budgetKobo: number;
  spentKobo: number;
  remainingKobo: number;
  percentage: number;
  health: "safe" | "warning" | "overspent";
}

export interface MonthlyCashFlow {
  incomeKobo: number;
  expenseKobo: number;
  surplusKobo: number;
  categories: CategoryCashFlow[];
  unbudgetedCategories: CategoryCashFlow[];
}

export async function getMonthlyCashFlow(
  userId: string
): Promise<MonthlyCashFlow | null> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [user, budgetPlans, transactions] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { monthlyIncomeTarget: true },
      }),
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

    if (!user) return null;

    // Calculate total income (all CREDIT transactions this month)
    const incomeResult = await prisma.transaction.aggregate({
      where: {
        userId,
        type: "CREDIT",
        date: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { amount: true },
    });

    const incomeKobo = incomeResult._sum.amount || 0;

    // Build spending map: category -> amount
    const spendingMap = new Map<string, number>();
    let totalExpenseKobo = 0;

    for (const spending of transactions) {
      const category = spending.cleanCategory || "Uncategorized";
      const amount = spending._sum.amount || 0;
      spendingMap.set(category, amount);
      totalExpenseKobo += amount;
    }

    // Build budget map: category -> limit (in Kobo)
    const budgetMap = new Map<string, { limitKobo: number; type: string }>();
    for (const plan of budgetPlans) {
      const limitKobo = Math.round(Number(plan.limitAmount) * 100);
      budgetMap.set(plan.category, {
        limitKobo,
        type: plan.type,
      });
    }

    // Process budgeted categories
    const budgetedCategories: CategoryCashFlow[] = [];
    for (const [category, { limitKobo }] of budgetMap.entries()) {
      const spentKobo = spendingMap.get(category) || 0;
      const remainingKobo = Math.max(0, limitKobo - spentKobo);
      const percentage = limitKobo > 0 ? (spentKobo / limitKobo) * 100 : 0;

      let health: "safe" | "warning" | "overspent";
      if (spentKobo > limitKobo) {
        health = "overspent";
      } else if (percentage >= 80) {
        health = "warning";
      } else {
        health = "safe";
      }

      budgetedCategories.push({
        category,
        budgetKobo: limitKobo,
        spentKobo,
        remainingKobo,
        percentage: Math.round(percentage * 10) / 10,
        health,
      });

      spendingMap.delete(category);
    }

    // Remaining unbudgeted categories
    const unbudgetedCategories: CategoryCashFlow[] = [];
    for (const [category, spentKobo] of spendingMap.entries()) {
      if (category !== "Uncategorized" && spentKobo > 0) {
        unbudgetedCategories.push({
          category,
          budgetKobo: 0,
          spentKobo,
          remainingKobo: -spentKobo,
          percentage: 100,
          health: "overspent",
        });
      }
    }

    // "Uncategorized" if there is any
    const uncategorizedAmount = spendingMap.get("Uncategorized") || 0;
    if (uncategorizedAmount > 0) {
      unbudgetedCategories.push({
        category: "Uncategorized",
        budgetKobo: 0,
        spentKobo: uncategorizedAmount,
        remainingKobo: -uncategorizedAmount,
        percentage: 100,
        health: "overspent",
      });
    }

    const surplusKobo = incomeKobo - totalExpenseKobo;

    return {
      incomeKobo,
      expenseKobo: totalExpenseKobo,
      surplusKobo,
      categories: budgetedCategories.sort((a, b) => b.spentKobo - a.spentKobo),
      unbudgetedCategories: unbudgetedCategories.sort(
        (a, b) => b.spentKobo - a.spentKobo
      ),
    };
  } catch (error) {
    console.error("[CashFlow] Failed to get monthly cash flow:", error);
    return null;
  }
}
