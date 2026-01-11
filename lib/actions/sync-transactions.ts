"use server";

import { processTransactionBatch } from "@/lib/ai-categorizer";

export async function triggerCategorizationAction(
  txIds: string[]
): Promise<void> {
  if (txIds.length === 0) return;

  console.log(
    `[Action] Triggering categorization for ${txIds.length} transactions`
  );

  // Fire and forget - don't await to keep UI responsive
  // Using setImmediate pattern for non-blocking execution
  setImmediate(async () => {
    try {
      await processTransactionBatch(txIds);
    } catch (error) {
      console.error("[Action] Background categorization failed:", error);
    }
  });
}

export async function triggerCategorizationSync(txIds: string[]): Promise<{
  success: boolean;
  processed: number;
}> {
  if (txIds.length === 0) {
    return { success: true, processed: 0 };
  }

  try {
    await processTransactionBatch(txIds);
    return { success: true, processed: txIds.length };
  } catch (error) {
    console.error("[Action] Sync categorization failed:", error);
    return { success: false, processed: 0 };
  }
}
