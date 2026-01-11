import { Button } from "@/components/ui/button";
import {
  KeyIcon,
  ClockCounterClockwiseIcon,
} from "@phosphor-icons/react/dist/ssr";
import { ArrowLeft, LucideShieldUser } from "lucide-react";
import Link from "next/link";
import { ChangePasswordDialog } from "@/components/security/change-password-dialog";
import { DeleteAccountDialog } from "@/components/security/delete-account-dialog";
import { ExportDataDialog } from "@/components/security/export-data-dialog";

export default async function Security() {
  return (
    <div className="min-h-screen bg-background h-screen overflow-hidden">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 flex flex-col gap-6">
        <Link
          href="/profile"
          className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm mb-4"
        >
          <ArrowLeft size={16} />
          Back to Profile
        </Link>
        <section
          id="profile"
          className="pb-8 relative font-mono rounded-3xl flex flex-col items-center sm:items-start gap-6"
        >
          <div className="grow text-center sm:text-left w-full">
            <h1 className="font-sans text-3xl font-semibold text-primary dark:text-white mb-1">
              Security Settings
            </h1>
            <p className="text-gray-500 text-sm dark:text-text-dark-secondary mb-4 flex justify-between items-center w-full">
              Manage your account security settings here.
            </p>
          </div>
        </section>
        <section
          id="password-management"
          className="py-8 relative font-mono  bg-white rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-6"
        >
          <div className="flex gap-3 items-center w-full">
            <KeyIcon
              size={20}
              className="text-gray-600 dark:text-gray-300"
              weight="fill"
            />
            <div className="flex flex-col flex-1">
              <h2 className="font-sans text-lg font-medium text-gray-900 dark:text-white">
                Password Management
              </h2>
            </div>
          </div>
          <div className="flex justify-between items-center bg-helm-blue/5 border border-helm-blue/15 px-4 py-4 rounded-2xl cursor-pointer w-full">
            <div className="flex items-center gap-4">
              <ClockCounterClockwiseIcon
                size={20}
                className="text-gray-600 dark:text-gray-300"
                weight="fill"
              />
              <div className="flex flex-col">
                <h2 className="font-sans text-lg font-medium text-gray-900 dark:text-white">
                  Change Password
                </h2>
                <p className="text-xs text-gray-500 dark:text-text-dark-secondary">
                  Update your password regularly to keep your account secure.
                </p>
              </div>
            </div>
            <ChangePasswordDialog />
          </div>
        </section>
        <section
          id="data-privacy"
          className="py-8 relative font-mono  bg-white rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-6"
        >
          <div className="flex gap-3 items-center w-full">
            <LucideShieldUser
              size={20}
              className="text-gray-600 dark:text-gray-300"
            />
            <div className="flex flex-col flex-1">
              <h2 className="font-sans text-lg font-medium text-gray-900 dark:text-white">
                Data Privacy
              </h2>
            </div>
          </div>

          <div className="flex flex-col justify-between items-center bg-helm-blue/5 border border-helm-blue/15 px-4 py-4 rounded-2xl cursor-pointer w-full">
            <div className="flex items-center gap-4">
              <p className="text-xs text-gray-500 dark:text-text-dark-secondary">
                Control how your data is being used. Request data export or
                account deletion.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full">
              <ExportDataDialog />
              <DeleteAccountDialog />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
