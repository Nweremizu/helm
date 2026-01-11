import { prisma } from "@/prisma/db";
import type { NetWorthPoint } from "./types";

const MONO_API_URL = "https://api.withmono.com/v2";

export async function captureDailySnapshot(userId: string): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const accounts = await prisma.linkedAccount.findMany({
    where: { userId },
    select: { id: true, monoAccountId: true, balance: true },
  });

  let totalBalance = 0;

  for (const account of accounts) {
    const freshBalance = await fetchBalanceFromMono(account.monoAccountId);

    if (freshBalance !== null) {
      await prisma.linkedAccount.update({
        where: { id: account.id },
        data: { balance: freshBalance },
      });
      totalBalance += freshBalance;
    } else {
      totalBalance += account.balance;
    }
  }

  const velocity = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId,
      date: { gte: today, lt: tomorrow },
    },
    _sum: { amount: true },
  });

  const totalIncome =
    velocity.find((v) => v.type === "CREDIT")?._sum.amount || 0;
  const totalExpense =
    velocity.find((v) => v.type === "DEBIT")?._sum.amount || 0;

  await prisma.dailySnapshot.upsert({
    where: { userId_date: { userId, date: today } },
    update: {
      totalBalance,
      totalIncome,
      totalExpense,
    },
    create: {
      userId,
      date: today,
      totalBalance,
      totalIncome,
      totalExpense,
    },
  });

  console.log(
    `[Snapshot] Captured for user ${userId}: Balance=${totalBalance}, Income=${totalIncome}, Expense=${totalExpense}`
  );
}

export async function captureSnapshotsForAllUsers(): Promise<number> {
  const users = await prisma.user.findMany({
    where: {
      accounts: { some: {} },
    },
    select: { id: true },
  });

  console.log(`[Snapshot] Capturing snapshots for ${users.length} users`);

  let successCount = 0;

  for (const user of users) {
    try {
      await captureDailySnapshot(user.id);
      successCount++;
    } catch (error) {
      console.error(`[Snapshot] Failed for user ${user.id}:`, error);
    }
  }

  return successCount;
}

async function fetchBalanceFromMono(
  monoAccountId: string
): Promise<number | null> {
  const secretKey = process.env.MONO_SECRET_API_KEY;

  if (!secretKey) {
    console.warn("[Snapshot] MONO_SECRET_API_KEY not set");
    return null;
  }

  try {
    const response = await fetch(`${MONO_API_URL}/accounts/${monoAccountId}`, {
      headers: {
        "mono-sec-key": secretKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`[Snapshot] Mono API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.data?.account?.balance || null;
  } catch (error) {
    console.error("[Snapshot] Failed to fetch balance:", error);
    return null;
  }
}

export async function getNetWorthTrend(
  userId: string,
  days: number = 30
): Promise<NetWorthPoint[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const snapshots = await prisma.dailySnapshot.findMany({
    where: {
      userId,
      date: { gte: startDate },
    },
    orderBy: { date: "asc" },
    select: {
      date: true,
      totalBalance: true,
    },
  });

  return snapshots.map((s) => ({
    date: s.date.toISOString().split("T")[0],
    balanceKobo: s.totalBalance,
    balanceNaira: s.totalBalance / 100,
  }));
}
