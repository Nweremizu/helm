"use server";

import { getUser } from "@/lib/auth/dal";
import { prisma } from "@/prisma/db";
import { processUserQuery } from "@/lib/ai/sonar-chat";
import { ensureOverspendingTrendInsights } from "@/lib/ai/sonar-overspend";

export async function askSonar(query: string) {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const response = await processUserQuery(user.id, query);
    return { data: response };
  } catch (error) {
    console.error("[askSonar] Error processing query:", error);
    return { error: "Failed to process your question" };
  }
}

export async function markInsightRead(insightId: string) {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const insight = await prisma.insight.findUnique({
      where: { id: insightId },
    });

    if (!insight || insight.userId !== user.id) {
      return { error: "Insight not found" };
    }

    await prisma.insight.update({
      where: { id: insightId },
      data: { isRead: true },
    });

    return { success: true };
  } catch (error) {
    console.error("[markInsightRead] Error:", error);
    return { error: "Failed to update insight" };
  }
}

export async function getUnreadInsights() {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    try {
      await ensureOverspendingTrendInsights(user.id);
    } catch (error) {
      console.error(
        "[getUnreadInsights] Trend insight generation failed:",
        error
      );
    }

    const insights = await prisma.insight.findMany({
      where: {
        userId: user.id,
        isRead: false,
        archivedAt: null,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return { data: insights };
  } catch (error) {
    console.error("[getUnreadInsights] Error:", error);
    return { error: "Failed to fetch insights" };
  }
}

export async function archiveInsightsOlderThan(days: number) {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await prisma.insight.updateMany({
      where: {
        userId: user.id,
        createdAt: { lt: cutoffDate },
        archivedAt: null,
      },
      data: { archivedAt: new Date() },
    });

    console.log(
      `[archiveInsights] Archived ${result.count} insights older than ${days} days`
    );
    return { success: true, count: result.count };
  } catch (error) {
    console.error("[archiveInsights] Error:", error);
    return { error: "Failed to archive insights" };
  }
}
