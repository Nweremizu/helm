// app/test-lab/actions.ts
"use server";

import { getUser } from "@/lib/auth/dal";
import { prisma } from "@/prisma/db";
import { syncAccount } from "@/lib/services/sync-service";

interface LinkAccountResult {
  status: "successful" | string;
  message?: string;
  timestamp?: string;
  data: {
    id: string;
  };
}

export async function linkBankAccount(code: string) {
  try {
    const mainUser = await getUser();
    if (!mainUser) {
      return { success: false, error: "Unauthorized" };
    }
    console.log("🔒 Server: Received Auth Code:", code);

    // 1. EXCHANGE CODE FOR ACCOUNT ID (Server-to-Server)
    const response = await fetch("https://api.withmono.com/v2/accounts/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "mono-sec-key": process.env.MONO_SECRET_API_KEY!, // Safe here
      },
      body: JSON.stringify({ code }),
    });

    const monoData = (await response.json()) as LinkAccountResult;
    const accountId = monoData.data.id;

    // Using the account ID, we get the account details from Mono
    const accountDetailsResponse = await fetch(
      `https://api.withmono.com/v2/accounts/${accountId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "mono-sec-key": process.env.MONO_SECRET_API_KEY!, // Safe here
        },
      }
    );

    if (!accountDetailsResponse.ok) {
      console.error("Failed to fetch account details from Mono API");
      return { success: false, error: "Failed to fetch account details" };
    }
    const accountDetails = await accountDetailsResponse.json();
    console.log("🏦 Fetched Account Details from Mono:", accountDetails);

    // 3. LINK ACCOUNT TO USER IN DATABASE
    const linkedAccount = await prisma.linkedAccount.create({
      data: {
        userId: mainUser.id,
        monoAccountId: accountId,
        bankName: accountDetails.data.account.institution.name,
        accountName: accountDetails.data.account.name,
        balance: accountDetails.data.account.balance,
        lastSyncedAt: new Date(),
        accountType: accountDetails.data.account.type,
      },
    });

    // 4. TRIGGER INITIAL SYNC & CATEGORIZATION
    console.log("🔄 Triggering initial sync for account:", linkedAccount.id);
    // We don't await this to return success to the UI faster,
    // but syncAccount itself triggers the background categorization.
    syncAccount(linkedAccount.id, linkedAccount.monoAccountId, mainUser.id);

    return { success: true, monoId: accountId };
  } catch (error) {
    console.error("Server Action Failed:", error);
    return { success: false, error: "Internal Server Error" };
  }
}
