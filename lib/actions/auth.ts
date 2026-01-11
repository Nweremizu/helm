/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { z } from "zod";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
  deleteSessionTokenCookie,
  validateSessionToken,
} from "@/lib/auth/session";
import { prisma } from "@/prisma/db"; // Your prisma client instance
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const authRegisterSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function registerAction(prevState: any, formData: FormData) {
  // 1. Validate Input
  const data = Object.fromEntries(formData);
  const parsed = authRegisterSchema.safeParse(data);

  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const { name, email, password } = parsed.data;

  // 2. Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "User already exists" };
  }

  // 3. Hash Password
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    // 4. Create User
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    // 5. Create Session
    const token = generateSessionToken();
    const session = await createSession(token, user.id);
    await setSessionTokenCookie(token, session.expiresAt);
  } catch (error) {
    return { error: "Registration failed" };
  }

  redirect("/");
}

export async function loginAction(prevState: any, formData: FormData) {
  // 1. Validate Input
  const data = Object.fromEntries(formData);
  const parsed = authSchema.safeParse(data);

  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const { email, password } = parsed.data;
  // 2. Find User
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: "This user does not exist" };
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordValid) {
    return { error: "Invalid email or password" };
  }

  // 3. Create Session
  const token = generateSessionToken();
  const session = await createSession(token, user.id);
  await setSessionTokenCookie(token, session.expiresAt);
  redirect("/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value ?? null;

  if (token) {
    const { session } = await validateSessionToken(token);
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
  }

  await deleteSessionTokenCookie();
  redirect("/login");
}
