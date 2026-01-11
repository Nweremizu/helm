"use client";

import { Toaster } from "@/components/ui/sonner";

export default function GlobalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="top-right" richColors />
      {children}
    </>
  );
}
