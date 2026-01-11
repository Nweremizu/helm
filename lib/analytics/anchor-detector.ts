import { prisma } from "@/prisma/db";

export interface SuggestedAnchor {
  merchantName: string;
  category: string | null;
  avgAmountKobo: number;
  occurrences: number;
  confidence: number;
  lastSeen: Date;
}

export async function detectAnchors(
  userId: string
): Promise<SuggestedAnchor[]> {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: "DEBIT",
      date: { gte: threeMonthsAgo },
      cleanName: { not: null },
    },
    select: {
      cleanName: true,
      cleanCategory: true,
      amount: true,
      date: true,
    },
    orderBy: { date: "desc" },
  });

  const merchantGroups = new Map<
    string,
    { amounts: number[]; category: string | null; lastSeen: Date }
  >();

  for (const tx of transactions) {
    const name = tx.cleanName!;
    if (!merchantGroups.has(name)) {
      merchantGroups.set(name, {
        amounts: [],
        category: tx.cleanCategory,
        lastSeen: tx.date,
      });
    }
    merchantGroups.get(name)!.amounts.push(tx.amount);
  }

  const suggestions: SuggestedAnchor[] = [];

  for (const [merchantName, data] of merchantGroups) {
    if (data.amounts.length < 2) continue;

    const avgAmount =
      data.amounts.reduce((a, b) => a + b, 0) / data.amounts.length;

    const variance =
      data.amounts.reduce((sum, amt) => sum + Math.abs(amt - avgAmount), 0) /
      data.amounts.length;
    const variancePercent = (variance / avgAmount) * 100;

    if (variancePercent <= 10) {
      const confidence = Math.min(
        100,
        50 + data.amounts.length * 10 + (10 - variancePercent) * 2
      );

      suggestions.push({
        merchantName,
        category: data.category,
        avgAmountKobo: Math.round(avgAmount),
        occurrences: data.amounts.length,
        confidence: Math.round(confidence),
        lastSeen: data.lastSeen,
      });
    }
  }

  return suggestions
    .filter((s) => s.confidence >= 60)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 10);
}
