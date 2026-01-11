import { NextRequest, NextResponse } from "next/server";
import { validateSessionToken } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { syncAccount } from "@/lib/services/sync-service";
import { prisma } from "@/prisma/db";

export async function POST(request: NextRequest) {
  const token = (await cookies()).get("session")?.value ?? null;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = await validateSessionToken(token);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { accountId } = await request.json();

    if (!accountId) {
      return NextResponse.json(
        { error: "accountId is required" },
        { status: 400 }
      );
    }

    const account = await prisma.linkedAccount.findFirst({
      where: {
        id: accountId,
        userId: user.id,
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const result = await syncAccount(
      account.id,
      account.monoAccountId,
      user.id
    );

    return NextResponse.json({
      success: true,
      synced: result.synced,
      newTransactions: result.newTransactions.length,
      totalPages: result.totalPages,
      stoppedEarly: result.stoppedEarly,
      message: `Synced ${result.synced} new transactions across ${result.totalPages} page(s)`,
    });
  } catch (error) {
    console.error("Sync failed:", error);
    return NextResponse.json(
      { error: "Failed to sync transactions" },
      { status: 500 }
    );
  }
}
