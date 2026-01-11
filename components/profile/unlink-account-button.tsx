"use client";

import { unlinkAccountAction } from "@/lib/actions/account";
import { Button } from "@/components/ui/button";
import { Link2OffIcon, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UnlinkAccountButtonProps {
  monoAccountId: string;
  accountName: string;
  isOnlyAccount: boolean;
}

export function UnlinkAccountButton({
  monoAccountId,
  accountName,
  isOnlyAccount,
}: UnlinkAccountButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleUnlink = () => {
    startTransition(async () => {
      const result = await unlinkAccountAction(monoAccountId);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.message);
      }
    });
  };

  if (isOnlyAccount) {
    return (
      <Button
        variant="ghost"
        disabled
        title="You must keep at least one linked account"
        className="cursor-not-allowed opacity-50"
      >
        <Link2OffIcon size={20} className="inline-block mr-1 text-gray-500" />
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="hover:text-red-500"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 size={20} className="animate-spin mr-1" />
          ) : (
            <Link2OffIcon size={20} className="inline-block mr-1" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unlink Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to unlink <strong>{accountName}</strong>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUnlink}
            className="bg-red-600 hover:bg-red-700"
          >
            Unlink
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
