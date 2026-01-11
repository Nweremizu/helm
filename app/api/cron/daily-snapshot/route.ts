import { NextRequest, NextResponse } from "next/server";
import { captureSnapshotsForAllUsers } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[Cron] Starting daily snapshot capture...");
    const count = await captureSnapshotsForAllUsers();
    console.log(`[Cron] Completed. Captured ${count} snapshots.`);

    return NextResponse.json({
      success: true,
      message: `Captured ${count} snapshots`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Cron] Failed:", error);
    return NextResponse.json(
      { error: "Snapshot capture failed" },
      { status: 500 }
    );
  }
}
