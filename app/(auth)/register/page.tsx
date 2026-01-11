"use client";

import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { registerAction } from "@/lib/actions/auth";
import { EnvelopeIcon, User } from "@phosphor-icons/react/dist/ssr";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { SetAuthCTA } from "@/components/auth/auth-cta";

export default function Register() {
  const [state, action, isPending] = useActionState(registerAction, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="flex flex-col">
      {/* Optional: hide the "Sign In" CTA for this page */}
      <SetAuthCTA />

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create an account
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Fill in the details to create your account.
        </p>
      </div>

      <form action={action} className="space-y-6">
        <div className="space-y-1">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Your name
          </label>
          <div className="relative">
            <Input
              id="name"
              name="name"
              type="text"
              icon={<User weight="duotone" size={16} />}
              required
              placeholder="Jane Doe"
              className=""
            />
          </div>
        </div>

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
              autoComplete="new-password"
              required
              placeholder="Enter a password (min 8 characters)"
              className=""
            />
          </div>
        </div>

        <Button loading={isPending} type="submit" className="w-full mt-4">
          Create account
        </Button>

        <hr className="my-6 border-t" />

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          By creating an account you agree to our{" "}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>
          . Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
