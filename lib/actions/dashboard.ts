"use server";

import { getUser } from "@/lib/auth/dal";
import { prisma } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import {
  getPulseMetrics,
  detectSalary,
  getMonthlySpendingBreakdown,
  getNetWorthTrend,
  getDailySpending,
  detectRecurringTransactions,
  captureDailySnapshot,
  type DashboardMetrics,
} from "@/lib/analytics";
import {
  getMonthlyCashFlow,
  type MonthlyCashFlow,
} from "@/lib/analytics/cash-flow";

export interface ExtendedDashboardMetrics extends DashboardMetrics {
  cashFlow: MonthlyCashFlow | null;
}

export async function getDashboardMetrics(): Promise<
  { data: ExtendedDashboardMetrics } | { error: string }
> {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const [
      pulse,
      salary,
      spendingBreakdown,
      netWorthTrend,
      dailyVelocity,
      recurringBills,
      cashFlow,
    ] = await Promise.all([
      getPulseMetrics(user.id),
      detectSalary(user.id),
      getMonthlySpendingBreakdown(user.id),
      getNetWorthTrend(user.id, 30),
      getDailySpending(user.id, 30),
      detectRecurringTransactions(user.id),
      getMonthlyCashFlow(user.id).catch(() => null),
    ]);

    return {
      data: {
        pulse,
        salary,
        spendingBreakdown,
        netWorthTrend,
        dailyVelocity,
        recurringBills,
        cashFlow,
      },
    };
  } catch (error) {
    console.error("[Dashboard] Failed to get metrics:", error);
    return { error: "Failed to load dashboard metrics" };
  }
}

export async function triggerManualSnapshot(): Promise<
  { success: boolean } | { error: string }
> {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    await captureDailySnapshot(user.id);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("[Snapshot] Manual trigger failed:", error);
    return { error: "Failed to capture snapshot" };
  }
}

export async function tagSalarySource(
  keyword: string,
  expectedDay: number
): Promise<{ success: boolean } | { error: string }> {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  if (expectedDay < 1 || expectedDay > 31) {
    return { error: "Expected day must be between 1 and 31" };
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        salaryKeyword: keyword.toUpperCase(),
        expectedSalaryDay: expectedDay,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("[Salary] Failed to tag source:", error);
    return { error: "Failed to save salary settings" };
  }
}
