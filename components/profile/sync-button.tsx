"use client";

import React, { useState } from "react";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SyncButtonProps {
  accountId: string;
  className?: string;
}

export function SyncButton({ accountId, className }: SyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    const promise = fetch("/api/transactions/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountId }),
    });

    toast.promise(promise, {
      loading: "Syncing transactions...",
      success: () => {
        setIsSyncing(false);
        return "Sync complete! AI is categorizing in the background.";
      },
      error: () => {
        setIsSyncing(false);
        return "Failed to sync transactions.";
      },
    });

    try {
      const response = await promise;
      if (!response.ok) throw new Error("Sync failed");
    } catch (error) {
      console.error("Sync error:", error);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={isSyncing}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
        "bg-helm-blue/10 text-helm-blue hover:bg-helm-blue/20 border border-helm-blue/20",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      <ArrowsClockwise size={16} className={cn(isSyncing && "animate-spin")} />
      {isSyncing ? "Syncing..." : "Sync Now"}
    </button>
  );
}
