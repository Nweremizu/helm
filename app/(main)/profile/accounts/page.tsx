import { getSimpleUserAccountDetails } from "@/lib/data/account";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  BankIcon,
  InfoIcon,
  ShieldCheckeredIcon,
} from "@phosphor-icons/react/dist/ssr";
import { LinkAccountTrigger } from "@/components/profile/account-linker";
import { UnlinkAccountButton } from "@/components/profile/unlink-account-button";
import { SyncButton } from "@/components/profile/sync-button";

export default async function AccountsPage() {
  const data = await getSimpleUserAccountDetails();
  const accountCount = data?.accounts.length ?? 0;
  const isOnlyAccount = accountCount === 1;

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
              Linked Accounts
            </h1>
            <p className="text-gray-500 text-sm dark:text-text-dark-secondary mb-4 flex justify-between items-center w-full">
              Manage your linked bank accounts.
              <span className="text-blue-500 cursor-pointer py-1 px-2 rounded-2xl flex items-center bg-blue-100! border border-blue-500 text-xs font-medium">
                <ShieldCheckeredIcon
                  weight={"fill"}
                  size={16}
                  className="inline-block ml-1"
                />
                <span className="ml-2">Securely linked with Mono</span>
              </span>
            </p>
          </div>
          <section className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {data?.accounts.length === 0 && (
                <p className="text-gray-500 dark:text-text-dark-secondary text-sm">
                  You have no linked accounts. Connect your bank account to
                  start tracking your finances.
                </p>
              )}

              {data?.accounts.map((account) => (
                <div
                  key={account.id}
                  className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4"
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <BankIcon size={32} className="text-gray-500" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="font-sans text-lg font-semibold text-primary dark:text-white">
                        {account.accountName}
                      </h3>
                      <p className="text-gray-500 dark:text-text-dark-secondary text-sm">
                        {account.bankName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <SyncButton accountId={account.id} />
                    <UnlinkAccountButton
                      monoAccountId={account.monoAccountId}
                      accountName={account.accountName}
                      isOnlyAccount={isOnlyAccount}
                    />
                  </div>
                </div>
              ))}
            </div>

            <LinkAccountTrigger />

            <div className="flex gap-4 items-start mt-4 p-3 rounded-2xl bg-helm-blue/10 border border-helm-blue/50 dark:border-gray-800">
              <InfoIcon
                weight="fill"
                size={24}
                className="text-helm-blue mt-1"
              />
              <p className="text-primary-hover  text-sm dark:text-text-dark-secondary">
                <span className="font-medium text-helm-blue">
                  Data Privacy:
                </span>{" "}
                Helm uses read-only access to sync your transaction data. We
                cannot move funds or make changes to your bank accounts.
              </p>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
