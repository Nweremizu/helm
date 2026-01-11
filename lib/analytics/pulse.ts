import { prisma } from "@/prisma/db";
import type { PulseMetrics } from "./types";
import { getAverageDailySpend } from "./spending";
import { detectSalary } from "./salary-detector";
import { getUpcomingBillsTotal } from "./recurring-detector";

export async function getPulseMetrics(userId: string): Promise<PulseMetrics> {
  const [accounts, avgDailySpend, salary, upcomingBills] = await Promise.all([
    prisma.linkedAccount.findMany({
      where: { userId },
      select: { balance: true },
    }),
    getAverageDailySpend(userId, 30),
    detectSalary(userId),
    getUpcomingBillsTotal(userId, 30),
  ]);

  const currentBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  console.log(
    `[Pulse] Current Balance for user ${userId}: ${currentBalance} kobo`
  );
  const daysUntilSalary = salary.daysUntilNext;

  const projectedSpend = daysUntilSalary
    ? // TODO: Refine projection based on spending patterns with the daysUntilSalary
      avgDailySpend * 1
    : avgDailySpend * 14;

  const safeToSpend = Math.max(
    0,
    currentBalance - upcomingBills - projectedSpend
  );

  console.log(
    `[Pulse] avgDailySpend: ${avgDailySpend} kobo, upcomingBills: ${upcomingBills} kobo, daysUntilSalary: ${daysUntilSalary}, projectedSpend: ${projectedSpend} kobo, safeToSpend: ${safeToSpend} kobo`
  );
  console.log(
    `[Pulse] Salary detected: ${salary.detected}, Next salary in ${daysUntilSalary} days`
  );
  console.log(`[Pulse] Safe to Spend for user ${userId}: ${safeToSpend} kobo`);

  const burnRate = currentBalance > 0 ? avgDailySpend / currentBalance : 0;

  let safetyStatus: "safe" | "caution" | "danger";
  const safetyRatio = currentBalance > 0 ? safeToSpend / currentBalance : 0;

  if (safetyRatio > 0.3) {
    safetyStatus = "safe";
  } else if (safetyRatio > 0.1) {
    safetyStatus = "caution";
  } else {
    safetyStatus = "danger";
  }

  return {
    currentBalanceKobo: currentBalance,
    safeToSpendKobo: safeToSpend,
    upcomingBillsKobo: upcomingBills,
    avgDailySpendKobo: avgDailySpend,
    daysUntilSalary,
    burnRate: Math.round(burnRate * 10000) / 100,
    safetyStatus,
  };
}
