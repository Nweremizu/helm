import { prisma } from "@/prisma/db";
import type { SalaryInfo } from "./types";
import { SALARY_THRESHOLD_KOBO } from "./types";

const SALARY_KEYWORDS = [
  "SALARY",
  "PAYROLL",
  "WAGES",
  "PAY FROM",
  "MONTHLY PAY",
  "COMPENSATION",
];

export async function detectSalary(userId: string): Promise<SalaryInfo> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { salaryKeyword: true, expectedSalaryDay: true },
  });

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const largeCreditTransactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: "CREDIT",
      amount: { gte: SALARY_THRESHOLD_KOBO },
      date: { gte: threeMonthsAgo },
    },
    orderBy: { date: "desc" },
    take: 10,
  });

  if (largeCreditTransactions.length === 0) {
    return {
      detected: false,
      amountKobo: null,
      sourceKeyword: null,
      lastReceivedDate: null,
      expectedDay: user?.expectedSalaryDay || null,
      daysUntilNext: null,
    };
  }

  let salaryTransaction = null;

  if (user?.salaryKeyword) {
    salaryTransaction = largeCreditTransactions.find((tx) =>
      tx.originalNarration
        .toUpperCase()
        .includes(user.salaryKeyword!.toUpperCase())
    );
  }

  if (!salaryTransaction) {
    salaryTransaction = largeCreditTransactions.find((tx) => {
      const narration = tx.originalNarration.toUpperCase();
      return SALARY_KEYWORDS.some((keyword) => narration.includes(keyword));
    });
  }

  if (!salaryTransaction) {
    salaryTransaction = largeCreditTransactions[0];
  }

  const expectedDay =
    user?.expectedSalaryDay || salaryTransaction.date.getDate();
  const daysUntilNext = calculateDaysUntilSalary(expectedDay);
  const detectedKeyword = extractKeyword(salaryTransaction.originalNarration);

  return {
    detected: true,
    amountKobo: salaryTransaction.amount,
    sourceKeyword: detectedKeyword,
    lastReceivedDate: salaryTransaction.date,
    expectedDay,
    daysUntilNext,
  };
}

function calculateDaysUntilSalary(expectedDay: number): number {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let nextSalaryDate: Date;

  if (currentDay < expectedDay) {
    nextSalaryDate = new Date(currentYear, currentMonth, expectedDay);
  } else {
    nextSalaryDate = new Date(currentYear, currentMonth + 1, expectedDay);
  }

  const diffTime = nextSalaryDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function extractKeyword(narration: string): string {
  const upper = narration.toUpperCase();

  for (const keyword of SALARY_KEYWORDS) {
    if (upper.includes(keyword)) {
      return keyword;
    }
  }

  const words = narration.split(/\s+/).slice(0, 3).join(" ");
  return words.toUpperCase();
}
