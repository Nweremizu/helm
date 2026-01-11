import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { validateSessionToken } from "@/lib/auth/session";
import { toAuthDTO } from "@/lib/auth/dto";
import { redirect } from "next/navigation";

export const getCurrentSession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value ?? null;

  if (token === null) {
    return { session: null, user: null };
  }

  const { session, user } = await validateSessionToken(token);
  return { session, user };
});

// Secure User Fetcher
export const getUser = cache(async () => {
  const { user } = await getCurrentSession();
  if (!user) return null;

  // Return a safe DTO, not the raw ORM object
  return toAuthDTO(user);
});

// Protect a route - call this at the top of protected pages/actions
export const assertAuthenticated = async () => {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  return user;
};
