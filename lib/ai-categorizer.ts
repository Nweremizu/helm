import { prisma } from "@/prisma/db";
import {
  AIFactory,
  type TransactionInput,
  type CategorizationResult,
} from "./ai";

function koboToNaira(kobo: number): string {
  return (kobo / 100).toFixed(2);
}

export async function processTransactionBatch(txIds: string[]): Promise<void> {
  if (txIds.length === 0) return;

  console.log(`[Categorizer] Processing batch of ${txIds.length} transactions`);

  const transactions = await prisma.transaction.findMany({
    where: {
      id: { in: txIds },
      isProcessed: false,
    },
    select: {
      id: true,
      originalNarration: true,
      amount: true,
      type: true,
      date: true,
    },
  });

  if (transactions.length === 0) {
    console.log("[Categorizer] No unprocessed transactions found");
    return;
  }

  console.log(
    `[Categorizer] Found ${transactions.length} unprocessed transactions`
  );

  const merchantRules = await prisma.merchantRule.findMany();
  const ruleMap = new Map(
    merchantRules.map((rule) => [rule.keyword.toUpperCase(), rule])
  );

  const matchedByRules: string[] = [];
  const needsAI: typeof transactions = [];

  for (const tx of transactions) {
    const narrationUpper = tx.originalNarration.toUpperCase();
    let matched = false;

    for (const [keyword, rule] of ruleMap) {
      if (narrationUpper.includes(keyword)) {
        await prisma.$transaction([
          prisma.transaction.update({
            where: { id: tx.id },
            data: {
              cleanName: rule.cleanName,
              cleanCategory: rule.category,
              icon: rule.icon,
              isProcessed: true,
            },
          }),
          prisma.merchantRule.update({
            where: { id: rule.id },
            data: { matchCount: { increment: 1 } },
          }),
        ]);

        matchedByRules.push(tx.id);
        matched = true;
        break;
      }
    }

    if (!matched) {
      needsAI.push(tx);
    }
  }

  console.log(
    `[Categorizer] Rule-matched: ${matchedByRules.length}, Needs AI: ${needsAI.length}`
  );

  if (needsAI.length === 0) return;

  const aiInput: TransactionInput[] = needsAI.map((tx) => ({
    id: tx.id,
    narration: tx.originalNarration,
    amount_naira: koboToNaira(tx.amount),
    type: tx.type,
    date: tx.date.toISOString(),
  }));

  try {
    const provider = AIFactory.getProvider();
    const results = await provider.categorizeBatch(aiInput);

    await applyCategorizationResults(results);
    console.log(`[Categorizer] AI processed ${results.length} transactions`);
  } catch (error) {
    console.error("[Categorizer] AI categorization failed:", error);
    await markAsProcessedWithFallback(needsAI.map((tx) => tx.id));
  }
}

async function applyCategorizationResults(
  results: CategorizationResult[]
): Promise<void> {
  for (const result of results) {
    await prisma.transaction.update({
      where: { id: result.id },
      data: {
        cleanName: result.cleanName,
        cleanCategory: result.category,
        icon: result.icon,
        isProcessed: true,
      },
    });

    if (result.ruleKeyword && result.confidence >= 0.8) {
      await prisma.merchantRule.upsert({
        where: { keyword: result.ruleKeyword.toUpperCase() },
        create: {
          keyword: result.ruleKeyword.toUpperCase(),
          cleanName: result.cleanName,
          category: result.category,
          icon: result.icon,
          matchCount: 1,
        },
        update: {
          matchCount: { increment: 1 },
        },
      });

      console.log(`[Categorizer] Learned new rule: ${result.ruleKeyword}`);
    }
  }
}

async function markAsProcessedWithFallback(txIds: string[]): Promise<void> {
  await prisma.transaction.updateMany({
    where: { id: { in: txIds } },
    data: {
      cleanCategory: "Other",
      icon: "circle-help",
      isProcessed: true,
    },
  });
}
