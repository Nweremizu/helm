/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { z } from "zod";
import { prisma } from "@/prisma/db";
import {
  validateSessionToken,
  deleteSessionTokenCookie,
} from "@/lib/auth/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
});

export async function updateProfileAction(prevState: any, formData: FormData) {
  const token = (await cookies()).get("session")?.value ?? null;
  if (!token) {
    return { error: "Unauthorized" };
  }

  const { user } = await validateSessionToken(token);
  if (!user) {
    return { error: "Unauthorized" };
  }

  const data = Object.fromEntries(formData);
  const parsed = updateProfileSchema.safeParse(data);

  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const { name, email } = parsed.data;

  try {
    // Check if email is taken by another user
    if (email !== user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return { error: "Email already in use" };
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { name, email },
    });

    revalidatePath("/profile");
    revalidatePath("/profile/edit");

    return { success: "Profile updated successfully" };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { error: "Failed to update profile" };
  }
}

const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordActionState = { error: string } | { success: string } | null;

export async function updatePasswordAction(
  prevState: PasswordActionState,
  formData: FormData
): Promise<PasswordActionState> {
  const token = (await cookies()).get("session")?.value ?? null;
  if (!token) {
    return { error: "Unauthorized" };
  }

  const { user } = await validateSessionToken(token);
  if (!user) {
    return { error: "Unauthorized" };
  }

  const data = Object.fromEntries(formData);
  const parsed = updatePasswordSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { currentPassword, newPassword } = parsed.data;

  try {
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    if (!fullUser) {
      return { error: "User not found" };
    }

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      fullUser.passwordHash
    );

    if (!isValidPassword) {
      return { error: "Current password is incorrect" };
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return { success: "Password updated successfully" };
  } catch (error) {
    console.error("Failed to update password:", error);
    return { error: "Failed to update password" };
  }
}

export async function deleteAccountAction(password: string) {
  const token = (await cookies()).get("session")?.value ?? null;
  if (!token) {
    return { error: "Unauthorized" };
  }

  const { user } = await validateSessionToken(token);
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    if (!fullUser) {
      return { error: "User not found" };
    }

    const isValidPassword = await bcrypt.compare(
      password,
      fullUser.passwordHash
    );
    if (!isValidPassword) {
      return { error: "Incorrect password" };
    }

    const linkedAccounts = await prisma.linkedAccount.findMany({
      where: { userId: user.id },
    });

    for (const account of linkedAccounts) {
      try {
        await fetch(
          `https://api.withmono.com/v2/accounts/${account.monoAccountId}/unlink`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "mono-sec-key": process.env.MONO_SECRET_API_KEY || "",
            },
          }
        );
      } catch (monoError) {
        console.error("Failed to unlink account from Mono:", monoError);
      }
    }

    await prisma.$transaction([
      prisma.dailySnapshot.deleteMany({ where: { userId: user.id } }),
      prisma.transaction.deleteMany({ where: { userId: user.id } }),
      prisma.budgetPlan.deleteMany({ where: { userId: user.id } }),
      prisma.linkedAccount.deleteMany({ where: { userId: user.id } }),
      prisma.session.deleteMany({ where: { userId: user.id } }),
      prisma.user.delete({ where: { id: user.id } }),
    ]);

    await deleteSessionTokenCookie();
  } catch (error) {
    console.error("Failed to delete account:", error);
    return { error: "Failed to delete account" };
  }

  redirect("/");
}

export async function verifyPasswordAction(password: string) {
  const token = (await cookies()).get("session")?.value ?? null;
  if (!token) {
    return { error: "Unauthorized" };
  }

  const { user } = await validateSessionToken(token);
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    if (!fullUser) {
      return { error: "User not found" };
    }

    const isValidPassword = await bcrypt.compare(
      password,
      fullUser.passwordHash
    );
    if (!isValidPassword) {
      return { error: "Incorrect password" };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to verify password:", error);
    return { error: "Failed to verify password" };
  }
}
