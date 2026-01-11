import "server-only";
import { prisma } from "@/prisma/db";
import { getUser } from "@/lib/auth/dal";

async function fetchMonoAccountData(linkedAccountId: string) {
  const accountData = await fetch(
    `https://api.withmono.com/v2/accounts/${linkedAccountId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "mono-sec-key": process.env.MONO_SECRET_API_KEY || "",
      },
    }
  );

  if (!accountData.ok) {
    throw new Error("Failed to fetch account data from Mono API");
  }

  return accountData.json();
}

export async function getUserAccountDetails() {
  const user = await getUser();
  if (!user) {
    return null;
  }

  const fullUserData = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      accounts: true,
    },
  });

  if (!fullUserData) {
    return null;
  }

  if (fullUserData.accounts.length === 0) {
    return {
      user: {
        id: fullUserData.id,
        name: fullUserData.name,
        email: fullUserData.email,
        account: null,
      },
    };
  }

  const accountWithDetails = fullUserData.accounts[0];

  try {
    const accountDetails = await fetchMonoAccountData(
      accountWithDetails.monoAccountId
    );

    return {
      user: {
        id: fullUserData.id,
        name: fullUserData.name,
        email: fullUserData.email,
        account: accountDetails,
      },
    };
  } catch (error) {
    console.error("Error fetching Mono account data:", error);
    // Return user with null account if fetch fails, or handle as needed
    return {
      user: {
        id: fullUserData.id,
        name: fullUserData.name,
        email: fullUserData.email,
        account: null,
      },
    };
  }
}

export async function getSimpleUserAccountDetails() {
  const user = await getUser();
  if (!user) {
    return null;
  }

  const fullUserData = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      accounts: true,
    },
  });

  if (!fullUserData) {
    return null;
  }

  return {
    id: fullUserData.id,
    name: fullUserData.name,
    email: fullUserData.email,
    accounts: fullUserData.accounts,
  };
}
