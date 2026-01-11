"use server";

import { CURRENT_MONO_API_URL } from "@/lib/utils";
import { prisma } from "@/prisma/db";

export async function getAccountBalance(monoAccountId: string) {
  try {
    console.log(
      "🔒 Server: Fetching Balance for Mono Account ID:",
      monoAccountId
    );
    const response = await fetch(
      `${CURRENT_MONO_API_URL}/accounts/${monoAccountId}/balance`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "mono-sec-key": process.env.MONO_SECRET_API_KEY!, // Safe here
        },
      }
    );

    const responseData = await response.json();
    if (responseData.status === "failed") {
      throw new Error(`Mono API Error: ${responseData.message}`);
    }

    const balance = responseData.data.balance;
    const currency = responseData.data.currency;
    const timestamp = responseData.timestamp;
    const account_number = responseData.data.account_number;
    console.log(
      `✅ Server: Fetched Balance: ${balance} ${currency} at ${timestamp} for Account Number: ${account_number}`
    );

    // Update the balance in the database
    const updatedAccount = await prisma.linkedAccount.updateMany({
      where: { monoAccountId },
      data: { balance },
    });

    console.log(
      "💾 Database: Updated balance for LinkedAccount:",
      updatedAccount
    );
  } catch (error) {
    console.error("❌ Server: Error fetching balance:", error);
    throw error;
  }
}

export async function getLinkedAccountById(monoAccountId: string) {
  return prisma.linkedAccount.findUnique({
    where: { monoAccountId },
  });
}

export async function getAllLinkedAccountsForUser(userId: string) {
  return prisma.linkedAccount.findMany({
    where: { userId },
  });
}

export async function getMonoAccountDetails(monoAccountId: string) {
  try {
    console.log(
      "🔒 Server: Fetching Account Details for Mono Account ID:",
      monoAccountId
    );

    const response = await fetch(
      `${CURRENT_MONO_API_URL}/accounts/${monoAccountId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "mono-sec-key": process.env.MONO_SECRET_API_KEY!, // Safe here
        },
      }
    );

    const responseData = await response.json();
    if (responseData.status === "failed") {
      throw new Error(`Mono API Error: ${responseData.message}`);
    }

    console.log("✅ Server: Fetched Account Details:", responseData.data);
    return responseData.data;
  } catch (error) {
    console.error("❌ Server: Error fetching account details:", error);
    throw error;
  }
}

export async function getMonoTransactions(
  monoAccountId: string,
  meta: {
    page?: number; // Default 1
    limit?: number; // Default 50
    start?: string; // 02-01-2024
    end?: string; // 02-29-2024
    narration?: string; // Filter by narration
    type?: "credit" | "debit"; // Filter by type
  }
) {
  try {
    console.log(
      "🔒 Server: Fetching Transactions for Mono Account ID:",
      monoAccountId,
      "with meta:",
      meta
    );
    const queryParams = new URLSearchParams();
    if (meta.page) queryParams.append("page", meta.page.toString());
    if (meta.limit) queryParams.append("perPage", meta.limit.toString());
    if (meta.start) queryParams.append("startDate", meta.start);
    if (meta.end) queryParams.append("endDate", meta.end);
    if (meta.narration) queryParams.append("narration", meta.narration);
    if (meta.type) queryParams.append("type", meta.type);
    const response = await fetch(
      `${CURRENT_MONO_API_URL}/accounts/${monoAccountId}/transactions?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "mono-sec-key": process.env.MONO_SECRET_API_KEY!, // Safe here
        },
      }
    );

    const responseData = await response.json();
    if (responseData.status === "failed") {
      throw new Error(`Mono API Error: ${responseData.message}`);
    }

    console.log("✅ Server: Fetched Transactions:", responseData.meta);

    return {
      transactions: responseData.data,
      meta: responseData.meta,
    };
  } catch (error) {
    console.error("❌ Server: Error fetching transactions:", error);
    throw error;
  }
}
