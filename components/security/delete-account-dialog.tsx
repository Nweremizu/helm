"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAccountAction } from "@/lib/actions/user";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, TriangleAlert } from "lucide-react";

export function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    startTransition(async () => {
      const result = await deleteAccountAction(password);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="px-4 w-full">
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <TriangleAlert size={20} />
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            <span className="block mb-4">
              This action is <strong>permanent and irreversible</strong>. All
              your data will be deleted, including:
            </span>
            <ul className="list-disc list-inside space-y-1 mb-4 text-sm">
              <li>Your profile and account information</li>
              <li>All linked bank accounts (will be unlinked from Mono)</li>
              <li>All transaction history</li>
              <li>All budgets and saving goals</li>
              <li>All daily snapshots</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter your password to confirm
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Type <span className="font-mono font-bold">DELETE</span> to
              confirm
            </label>
            <Input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
            />
          </div>
          <div className="flex gap-3 justify-end mt-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending || confirmText !== "DELETE" || !password}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete My Account
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
