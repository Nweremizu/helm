"use server";

import { getUser } from "@/lib/auth/dal";
import { prisma } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function unlinkAccountAction(monoAccountId: string) {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const userAccounts = await prisma.linkedAccount.findMany({
    where: { userId: user.id },
  });

  if (userAccounts.length <= 1) {
    return {
      error:
        "You must have at least one linked account. Cannot unlink your only account.",
    };
  }

  try {
    const response = await fetch(
      `https://api.withmono.com/v2/accounts/${monoAccountId}/unlink`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "mono-sec-key": process.env.MONO_SECRET_API_KEY || "",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to unlink account with Mono"
      );
    }

    await prisma.linkedAccount.delete({
      where: {
        userId: user.id,
        monoAccountId,
      },
    });

    revalidatePath("/profile/accounts");
    return { success: true, message: "Account unlinked successfully" };
  } catch (error) {
    console.error("Error unlinking account:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to unlink account",
    };
  }
}
