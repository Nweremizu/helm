/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { validateSessionToken } from "@/lib/auth/session";
import { prisma } from "@/prisma/db";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import JSZip from "jszip";

function transactionsToCSV(transactions: any[]): string {
  if (transactions.length === 0) {
    return "id,date,description,amount,currency,category,type,balance\n";
  }

  const headers = [
    "id",
    "date",
    "description",
    "amount",
    "currency",
    "category",
    "type",
    "balance",
  ];

  const csvRows = [headers.join(",")];

  for (const tx of transactions) {
    const row = [
      tx.id,
      tx.date ? new Date(tx.date).toISOString() : "",
      `"${(tx.description || "").replace(/"/g, '""')}"`,
      tx.amount,
      tx.currency,
      tx.category || "",
      tx.type,
      tx.balance || "",
    ];
    csvRows.push(row.join(","));
  }

  return csvRows.join("\n");
}

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
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    if (!fullUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      fullUser.passwordHash
    );
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 403 }
      );
    }

    const fullUserData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        accounts: true,
        transactions: {
          orderBy: { date: "desc" },
        },
        budgets: true,
        snapshots: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!fullUserData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profileData = {
      exportDate: new Date().toISOString(),
      user: {
        id: fullUserData.id,
        name: fullUserData.name,
        email: fullUserData.email,
        currency: fullUserData.currency,
        avatarUrl: fullUserData.avatarUrl,
        isVerified: fullUserData.isVerified,
        createdAt: fullUserData.createdAt,
        updatedAt: fullUserData.updatedAt,
      },
      linkedAccounts: fullUserData.accounts.map((account) => ({
        id: account.id,
        monoAccountId: account.monoAccountId,
        accountName: account.accountName,
        accountNumber: account.institutionId,
        bankName: account.bankName,
        currency: account.currency,
        // linkedAt: account.linkedAt,
      })),
      budgets: fullUserData.budgets.map((budget) => ({
        id: budget.id,
        // name: budget.name,
        // totalAmount: budget.totalAmount,
        // currency: budget.currency,
        // startDate: budget.startDate,
        // endDate: budget.endDate,
        // isActive: budget.isActive,
        // categories: budget.categories,
      })),
      dailySnapshots: fullUserData.snapshots.map((snapshot) => ({
        id: snapshot.id,
        date: snapshot.date,
        totalBalance: snapshot.totalBalance,
        // currency: snapshot.currency,
      })),
    };

    const transactionsCSV = transactionsToCSV(fullUserData.transactions);

    const zip = new JSZip();
    zip.file("profile_data.json", JSON.stringify(profileData, null, 2));
    zip.file("transactions.csv", transactionsCSV);

    const zipBuffer = await zip.generateAsync({ type: "arraybuffer" });

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="helm_data_export_${
          new Date().toISOString().split("T")[0]
        }.zip"`,
      },
    });
  } catch (error) {
    console.error("Failed to export data:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
