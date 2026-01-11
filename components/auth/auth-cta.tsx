"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

type CTAOverrides = {
  hideSignIn?: boolean;
  hideGetStarted?: boolean;
  hideAll?: boolean;
};

type AuthCTAContextValue = {
  overrides: CTAOverrides;
  setOverrides: (v: CTAOverrides) => void;
};

const AuthCTAContext = createContext<AuthCTAContextValue | null>(null);

export function AuthCTAProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<CTAOverrides>({});

  const value = useMemo(() => ({ overrides, setOverrides }), [overrides]);

  return (
    <AuthCTAContext.Provider value={value}>{children}</AuthCTAContext.Provider>
  );
}

export function useAuthCTA() {
  const ctx = useContext(AuthCTAContext);
  if (!ctx) throw new Error("useAuthCTA must be used within AuthCTAProvider");
  return ctx;
}

export function AuthNavCTAs() {
  const pathname = usePathname() || "/";
  const ctx = useContext(AuthCTAContext);

  // If context is not available, render nothing (shouldn't happen when provider is used)
  if (!ctx) return null;

  const { overrides } = ctx;

  const showSignIn =
    !overrides.hideAll && !overrides.hideSignIn && pathname !== "/login";
  const showGetStarted =
    !overrides.hideAll && !overrides.hideGetStarted && pathname !== "/register";

  if (!showSignIn && !showGetStarted) return null;

  return (
    <div className="flex items-center gap-4">
      {showSignIn && (
        <div className="flex items-center">
          <p className="mr-2 text-sm text-gray-500">Already have an account?</p>
          <Link href="/login">
            <Button variant="outline">Sign In</Button>
          </Link>
        </div>
      )}

      {showGetStarted && (
        <div className="flex items-center">
          <p className="mr-2 text-sm text-gray-500">New to Helm?</p>
          <Link href="/register">
            <Button variant="default">Get Started</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export function SetAuthCTA(props: CTAOverrides) {
  const { setOverrides } = useAuthCTA();

  useEffect(() => {
    setOverrides(props);
    return () => {
      // Reset overrides on unmount
      setOverrides({});
    };
  }, [props, setOverrides]);

  return null;
}
