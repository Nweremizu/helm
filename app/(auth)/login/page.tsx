"use client";

import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { loginAction } from "@/lib/actions/auth";
import { EnvelopeIcon } from "@phosphor-icons/react/dist/ssr";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { SetAuthCTA } from "@/components/auth/auth-cta";

export default function Login() {
  const [state, action, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="flex flex-col">
      {/* Optional: hide the rail CTA elements for this page */}
      <SetAuthCTA />

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Please enter your details to sign in.
        </p>
      </div>
      <form action={action} className="space-y-6">
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email address
          </label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              icon={<EnvelopeIcon weight="duotone" size={16} />}
              required
              placeholder="you@example.com"
              className=""
            />
          </div>
        </div>
        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <div className="relative">
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              className=""
            />
          </div>
        </div>
        <Button loading={isPending} type="submit" className="w-full mt-4">
          Sign In
        </Button>

        <hr className="my-6 border-t" />

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          By continuing, you agree to our{" "}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  );
}
