import { prisma } from "@/prisma/db";
import type { InsightType } from "@/app/generated/prisma/enums";

interface PriceHikeDetection {
  currentAmount: number;
  previousAmount: number;
  percentageIncrease: number;
}

async function detectPriceHikes(
  userId: string,
  newTransactionIds: string[]
): Promise<void> {
  const newTransactions = await prisma.transaction.findMany({
    where: {
      id: { in: newTransactionIds },
      cleanName: { not: null },
    },
    select: {
      id: true,
      cleanName: true,
      amount: true,
      date: true,
    },
  });

  for (const tx of newTransactions) {
    if (!tx.cleanName) continue;

    const previousTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        cleanName: tx.cleanName,
        date: { lt: tx.date },
      },
      orderBy: { date: "desc" },
      take: 5,
      select: {
        amount: true,
        date: true,
      },
    });

    if (previousTransactions.length === 0) continue;

    const previousAmount = previousTransactions[0].amount;
    const percentageIncrease =
      ((tx.amount - previousAmount) / previousAmount) * 100;

    if (percentageIncrease > 10) {
      const increase = tx.amount - previousAmount;
      const prevNaira = (previousAmount / 100).toFixed(2);
      const currNaira = (tx.amount / 100).toFixed(2);
      const increaseNaira = (increase / 100).toFixed(2);

      await prisma.insight.create({
        data: {
          userId,
          type: "ALERT" as InsightType,
          title: `Price Hike: ${tx.cleanName}`,
          message: `Your ${
            tx.cleanName
          } subscription increased from ₦${prevNaira} to ₦${currNaira} (+₦${increaseNaira}, ${percentageIncrease.toFixed(
            1
          )}% increase).`,
          severity: percentageIncrease > 20 ? "critical" : "warning",
          relatedTransactionId: tx.id,
        },
      });

      console.log(
        `[DeepScan] Price hike detected for ${
          tx.cleanName
        }: ${percentageIncrease.toFixed(1)}% increase`
      );
    }
  }
}

async function detectDoubleCharges(
  userId: string,
  newTransactionIds: string[]
): Promise<void> {
  const newTransactions = await prisma.transaction.findMany({
    where: {
      id: { in: newTransactionIds },
    },
    select: {
      id: true,
      cleanName: true,
      amount: true,
      date: true,
    },
  });

  for (const tx of newTransactions) {
    const thirtyMinutesEarlier = new Date(tx.date.getTime() - 30 * 60 * 1000);
    const thirtyMinutesLater = new Date(tx.date.getTime() + 30 * 60 * 1000);

    const duplicates = await prisma.transaction.findMany({
      where: {
        userId,
        id: { not: tx.id },
        amount: tx.amount,
        cleanName: tx.cleanName,
        date: {
          gte: thirtyMinutesEarlier,
          lte: thirtyMinutesLater,
        },
      },
      select: {
        id: true,
        date: true,
      },
    });

    if (duplicates.length > 0) {
      const amountNaira = (tx.amount / 100).toFixed(2);

      await prisma.insight.create({
        data: {
          userId,
          type: "ALERT" as InsightType,
          title: "Potential Double Charge",
          message: `Two transactions for ₦${amountNaira} (${tx.cleanName}) detected within 30 minutes. This might be a duplicate charge. Review and report if unauthorized.`,
          severity: "critical",
          relatedTransactionId: tx.id,
        },
      });

      console.log(
        `[DeepScan] Double charge detected: ${tx.cleanName} x₦${amountNaira}`
      );
    }
  }
}

export async function runDeepScan(
  userId: string,
  newTransactionIds: string[]
): Promise<void> {
  if (!newTransactionIds || newTransactionIds.length === 0) {
    console.log("[DeepScan] No new transactions to scan");
    return;
  }

  console.log(
    `[DeepScan] Starting analysis for user ${userId} with ${newTransactionIds.length} new transactions`
  );

  try {
    await detectPriceHikes(userId, newTransactionIds);
    await detectDoubleCharges(userId, newTransactionIds);

    console.log("[DeepScan] Analysis complete");
  } catch (error) {
    console.error("[DeepScan] Failed to run deep scan:", error);
  }
}
