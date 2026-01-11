"use client";

import { createContext, useContext } from "react";
import { AuthDTO } from "@/lib/auth/dto";
import { assertAuthenticated } from "@/lib/auth/dal";
import { redirect } from "next/navigation";
import { useEffect } from "react";

type AuthContextType = {
  user: AuthDTO | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AuthDTO | null;
}) {
  // use effect to redirect if user is null
  useEffect(() => {
    if (user === null) {
      // if pathname is not /login,
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      )
        redirect("/login");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
