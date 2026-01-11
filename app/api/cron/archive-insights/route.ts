import { prisma } from "@/prisma/db";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await prisma.insight.updateMany({
      where: {
        createdAt: { lt: thirtyDaysAgo },
        archivedAt: null,
      },
      data: { archivedAt: new Date() },
    });

    console.log(
      `[CronArchive] Successfully archived ${result.count} insights older than 30 days`
    );

    return Response.json(
      {
        success: true,
        message: `Archived ${result.count} insights`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CronArchive] Error archiving insights:", error);
    return Response.json(
      { error: "Failed to archive insights" },
      { status: 500 }
    );
  }
}
