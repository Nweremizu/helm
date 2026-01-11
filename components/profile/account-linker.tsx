"use client";

import React from "react";
import dynamic from "next/dynamic";
import { linkBankAccount } from "@/lib/actions/mono/link-account";
import { PlusIcon } from "lucide-react";
import { LightningIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// UI Component for the card content to avoid duplication and handle loading state
const LinkAccountCard = ({ onClick }: { onClick?: () => void }) => (
  <div
    onClick={onClick}
    className="w-full rounded-3xl border-3 border-dashed border-neutral-400 p-8 pt-4 group hover:border-tertiary transition-colors duration-500 hover:bg-accent cursor-pointer"
  >
    <div className="flex w-full justify-end gap-2 text-gray-500">
      <p className="text-xs">POWERED BY MONO</p>
      <span className="ml-0.5">
        <LightningIcon weight="fill" size={14} />
      </span>
    </div>

    <div className="flex flex-col items-center justify-center gap-4 mt-4">
      <button className="p-6 bg-white rounded-full">
        <PlusIcon size={32} className="text-tertiary" />
      </button>
      <h4 className="font-sans text-lg font-semibold text-primary dark:text-white">
        Link New Account
      </h4>
      <p className="text-gray-500 max-w-md text-sm dark:text-text-dark-secondary text-center">
        Connect your bank account securely using Mono to start tracking your
        finances.
      </p>
    </div>
  </div>
);

const MonoConnect = dynamic(
  () =>
    // @ts-expect-error TS cannot infer types from dynamic imports
    import("@mono.co/connect.js").then((mod) => {
      return function MonoButton({
        onSuccess,
      }: {
        onSuccess: (code: string) => void;
      }) {
        const Connect = mod.default;

        const triggerWidget = () => {
          const mono = new Connect({
            key: process.env.NEXT_PUBLIC_MONO_PUBLIC_API_KEY!,
            onSuccess: (response: { code: string }) => {
              onSuccess(response.code);
            },
            onClose: () => console.log("Widget Closed"),
          });
          mono.setup();
          mono.open();
        };

        return <LinkAccountCard onClick={triggerWidget} />;
      };
    }),
  {
    ssr: false,
    loading: () => <LinkAccountCard />,
  }
);

export function LinkAccountTrigger() {
  const router = useRouter();

  const handleMonoSuccess = async (code: string) => {
    const toastId = toast.loading("Linking account...");
    try {
      const result = await linkBankAccount(code);
      if (result.success) {
        toast.success("Account linked successfully!", { id: toastId });
        router.refresh();
      } else {
        toast.error(result.error || "Failed to link account", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred", { id: toastId });
    }
  };

  return <MonoConnect onSuccess={handleMonoSuccess} />;
}
