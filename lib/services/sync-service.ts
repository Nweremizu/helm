import { prisma } from "@/prisma/db";
import { triggerCategorizationAction } from "@/lib/actions/sync-transactions";
import { runDeepScan } from "@/lib/ai/sonar-scanner";

type MonoTransaction = {
  id: string;
  narration: string;
  amount: number;
  type: "debit" | "credit";
  date: string;
  balance: number;
  currency: string;
};

type MonoApiResponse = {
  status: string;
  data: MonoTransaction[];
  meta: {
    total: number;
    page: number;
    next: string | null;
  };
};

export interface SyncResult {
  synced: number;
  newTransactions: string[];
  totalPages: number;
  stoppedEarly: boolean;
}

const MONO_API_BASE = "https://api.withmono.com/v2";
const PAGE_SIZE = 50;

export async function syncAccount(
  accountId: string,
  monoAccountId: string,
  userId: string
): Promise<SyncResult> {
  console.log(
    `[SyncService] Starting backward crawl for account: ${accountId}`
  );

  const allNewTransactionIds: string[] = [];
  let currentPage = 1;
  let totalPages = 1;
  let stoppedEarly = false;

  while (true) {
    console.log(`[SyncService] Fetching page ${currentPage}...`);

    const response = await fetchTransactionsFromMono(
      monoAccountId,
      currentPage
    );

    if (!response || response.data.length === 0) {
      console.log(
        `[SyncService] No more data on page ${currentPage}, stopping.`
      );
      break;
    }

    totalPages = Math.ceil(response.meta.total / PAGE_SIZE);

    const { newIds, allExisted } = await saveBatch(
      response.data,
      userId,
      accountId
    );

    allNewTransactionIds.push(...newIds);

    if (allExisted) {
      console.log(
        `[SyncService] All transactions on page ${currentPage} already exist. Stopping crawl.`
      );
      stoppedEarly = true;
      break;
    }

    if (!response.meta.next) {
      console.log(`[SyncService] No more pages available.`);
      break;
    }

    currentPage++;
  }

  console.log(
    `[SyncService] Sync complete. New transactions: ${allNewTransactionIds.length}`
  );

  if (allNewTransactionIds.length > 0) {
    console.log(
      `[SyncService] Triggering AI categorization for ${allNewTransactionIds.length} transactions`
    );
    triggerCategorizationAction(allNewTransactionIds);

    console.log(
      `[SyncService] Triggering Deep Scan for ${allNewTransactionIds.length} transactions`
    );
    await runDeepScan(userId, allNewTransactionIds);
  }

  await prisma.linkedAccount.update({
    where: { id: accountId },
    data: { lastSyncedAt: new Date() },
  });

  return {
    synced: allNewTransactionIds.length,
    newTransactions: allNewTransactionIds,
    totalPages,
    stoppedEarly,
  };
}

async function saveBatch(
  transactions: MonoTransaction[],
  userId: string,
  accountId: string
): Promise<{ newIds: string[]; allExisted: boolean }> {
  const newIds: string[] = [];
  let existingCount = 0;

  for (const tx of transactions) {
    const existing = await prisma.transaction.findUnique({
      where: { monoId: tx.id },
      select: { id: true },
    });

    if (existing) {
      existingCount++;
      continue;
    }

    const created = await prisma.transaction.create({
      data: {
        userId,
        accountId,
        monoId: tx.id,
        amount: tx.amount,
        type: tx.type === "debit" ? "DEBIT" : "CREDIT",
        date: new Date(tx.date),
        balance: tx.balance,
        originalNarration: tx.narration,
        currency: tx.currency || "NGN",
        isProcessed: false,
        rawBankData: tx as object,
      },
    });

    newIds.push(created.id);
  }

  const allExisted = existingCount === transactions.length;

  console.log(
    `[SyncService] Batch: ${transactions.length} total, ${newIds.length} new, ${existingCount} existing`
  );

  return { newIds, allExisted };
}

async function fetchTransactionsFromMono(
  monoAccountId: string,
  page: number
): Promise<MonoApiResponse | null> {
  const MONO_SECRET_KEY = process.env.MONO_SECRET_API_KEY;

  if (!MONO_SECRET_KEY) {
    console.warn("[SyncService] MONO_SECRET_API_KEY not set, using mock data");
    return getMockResponse(page);
  }

  try {
    const url = `${MONO_API_BASE}/accounts/${monoAccountId}/transactions?page=${page}&limit=${PAGE_SIZE}`;

    const response = await fetch(url, {
      headers: {
        "mono-sec-key": MONO_SECRET_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`[SyncService] Mono API error: ${response.status}`);
      return null;
    }

    return (await response.json()) as MonoApiResponse;
  } catch (error) {
    console.error("[SyncService] Failed to fetch from Mono:", error);
    return null;
  }
}

function getMockResponse(page: number): MonoApiResponse | null {
  if (page > 2) return null;

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const mockTransactions: MonoTransaction[] =
    page === 1
      ? [
          {
            id: `mono_${now}_1`,
            narration: "POS WDL UBER EATS LAGOS NG",
            amount: 550000,
            type: "debit",
            date: new Date(now - dayMs).toISOString(),
            balance: 24500000,
            currency: "NGN",
          },
          {
            id: `mono_${now}_2`,
            narration: "NIP TRF FROM JOHN DOE/SAVINGS",
            amount: 15000000,
            type: "credit",
            date: new Date(now - dayMs * 2).toISOString(),
            balance: 25050000,
            currency: "NGN",
          },
          {
            id: `mono_${now}_3`,
            narration: "NETFLIX.COM SUBSCRIPTION",
            amount: 499900,
            type: "debit",
            date: new Date(now - dayMs * 3).toISOString(),
            balance: 10050000,
            currency: "NGN",
          },
          {
            id: `mono_${now}_4`,
            narration: "ATM WDL GTB VI BRANCH",
            amount: 2000000,
            type: "debit",
            date: new Date(now - dayMs * 4).toISOString(),
            balance: 10549900,
            currency: "NGN",
          },
          {
            id: `mono_${now}_5`,
            narration: "POS SHOPRITE IKEJA MALL",
            amount: 1250075,
            type: "debit",
            date: new Date(now - dayMs * 5).toISOString(),
            balance: 12549900,
            currency: "NGN",
          },
        ]
      : [
          {
            id: `mono_${now}_6`,
            narration: "BOLT TECHNOLOGY OU RIDE",
            amount: 185000,
            type: "debit",
            date: new Date(now - dayMs * 6).toISOString(),
            balance: 13799975,
            currency: "NGN",
          },
          {
            id: `mono_${now}_7`,
            narration: "SALARY PAYMENT ACME CORP",
            amount: 85000000,
            type: "credit",
            date: new Date(now - dayMs * 7).toISOString(),
            balance: 13984975,
            currency: "NGN",
          },
        ];

  return {
    status: "successful",
    data: mockTransactions,
    meta: {
      total: 7,
      page,
      next: page === 1 ? `/transactions?page=2` : null,
    },
  };
}
