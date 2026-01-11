/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { getUser } from "@/lib/auth/dal";
import { logoutAction } from "@/lib/actions/auth";
import {
  BankIcon,
  BellIcon,
  HeadsetIcon,
  InfoIcon,
  LockIcon,
  MoneyIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  ChevronRight,
  HelpCircle,
  MessageSquareReplyIcon,
  Palette,
  SlidersHorizontalIcon,
  User2Icon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function Profile() {
  const user = await getUser();
  return (
    <div className="min-h-screen bg-background h-screen overflow-hidden">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 flex flex-col gap-6">
        <ProfileSection user={user} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AccountsSection />
          <PreferncesSection />
        </div>
        <SupportSection />
      </main>
    </div>
  );
}

function ProfileSection({ user }: { user: any }) {
  return (
    <section
      id="profile-header"
      className="py-8 relative font-mono  bg-white rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center sm:items-start gap-6"
    >
      {/* <div className="inline-flex flex-col sm:flex-row gap-10 items-center"> */}
      <Avatar className="w-24 h-24">
        <AvatarImage src={user.avatarUrl} alt={user.name} />
        <AvatarFallback className="text-3xl">
          {user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="grow text-center sm:text-left">
        <h1 className="font-sans text-2xl font-semibold text-primary dark:text-white mb-1">
          {user.name}
        </h1>
        <p className="text-text-secondary dark:text-text-dark-secondary mb-4">
          {user.email}
        </p>
        <div className="flex justify-center sm:justify-start gap-3">
          <span className="px-3 py-1 rounded-full bg-helm-gold/10 text-helm-gold text-xs font-medium border border-helm-gold/20">
            Premium Member
          </span>
          <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium border border-green-200 dark:border-green-800/50">
            Verified
          </span>
        </div>
      </div>
      {/* </div> */}
      <div className="flex items-center gap-2">
        <Link href="/profile/edit">
          <button className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-text-primary dark:text-white text-sm font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            Edit Profile
          </button>
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-text-primary dark:text-white text-sm font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Log out
          </button>
        </form>
      </div>
    </section>
  );
}

function AccountsSection() {
  return (
    <section
      id="Accounts"
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center gap-2 mb-6">
        <User2Icon size={20} className="text-blue-400" />
        <h3 className="font-sans font-medium text-lg">Account</h3>
      </div>
      <div className="flex flex-col gap-1">
        {/* Account items go here */}
        <Link href="/profile/accounts">
          <div className="p-3 flex gap-4 items-center rounded-2xl bg-white hover:bg-accent transition-colors duration-500 cursor-pointer">
            {/* Icon */}
            <div className="flex items-center gap-4 bg-gray-200 w-fit p-3 rounded-full">
              <BankIcon size={20} className="text-gray-600" />
            </div>
            <div className="flex justify-between w-full items-center">
              <div className="flex flex-col gap-0.5">
                <h3 className="font-mono font-medium text-base">
                  Linked Accounts
                </h3>
                <p className="font-mono text-xs text-gray-500">
                  Manage Bank Connections
                </p>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
          </div>
        </Link>
        <div className="h-px w-full bg-neutral-100" />
        <Link href="/profile/security">
          <div className="p-3 flex gap-4 items-center rounded-2xl bg-white hover:bg-accent transition-colors duration-500 cursor-pointer">
            {/* Icon */}
            <div className="flex items-center gap-4 bg-gray-200 w-fit p-3 rounded-full">
              <LockIcon size={20} className="text-gray-600" />
            </div>
            <div className="flex justify-between w-full items-center">
              <div className="flex flex-col gap-0.5">
                <h3 className="font-mono font-medium text-base">Security</h3>
                <p className="font-mono text-xs text-gray-500">
                  Passwords & 2FA
                </p>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

function PreferncesSection() {
  return (
    <section
      id="Preferences"
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontalIcon size={20} className="text-blue-400" />
        <h3 className="font-sans font-medium text-lg">Preferences</h3>
      </div>
      <div className="flex flex-col gap-1">
        <div className="p-3 flex gap-4 items-center rounded-2xl bg-white hover:bg-accent transition-colors duration-500 cursor-pointer">
          {/* Icon */}
          <div className="flex items-center gap-4 bg-gray-200 w-fit p-3 rounded-full">
            <BellIcon size={20} className="text-gray-600" />
          </div>
          <div className="flex justify-between w-full items-center">
            <div className="flex flex-col gap-0.5">
              <h3 className="font-mono font-medium text-base">Notifications</h3>
              <p className="font-mono text-xs text-gray-500">
                Alerts & Reminders
              </p>
            </div>
            <Switch />
          </div>
        </div>
        <div className="p-3 flex gap-4 items-center rounded-2xl bg-white hover:bg-accent transition-colors duration-500 cursor-pointer">
          {/* Icon */}
          <div className="flex items-center gap-4 bg-gray-200 w-fit p-3 rounded-full">
            <Palette size={20} className="text-gray-600" />
          </div>
          <div className="flex justify-between w-full items-center">
            <div className="flex flex-col gap-0.5">
              <h3 className="font-mono font-medium text-base">Theme</h3>
              <p className="font-mono text-xs text-gray-500">Light & Dark</p>
            </div>
            <Switch />
          </div>
        </div>
        <div className="p-3 flex gap-4 items-center rounded-2xl bg-white hover:bg-accent transition-colors duration-500 cursor-pointer">
          {/* Icon */}
          <div className="flex items-center gap-4 bg-gray-200 w-fit p-3 rounded-full">
            <MoneyIcon size={20} className="text-gray-600" />
          </div>
          <div className="flex justify-between w-full items-center">
            <div className="flex flex-col gap-0.5">
              <h3 className="font-mono font-medium text-base">Currency</h3>
              <p className="font-mono text-xs text-gray-500">USD, EUR, NGN</p>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SupportSection() {
  return (
    <section
      id="Support"
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle size={20} className="text-blue-400" />
        <h3 className="font-sans font-medium text-lg">Support</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Support items go here */}
        <div className="p-4  bg-gray-50 rounded-2xl hover:bg-accent flex flex-col items-center justify-center transition-colors duration-500 cursor-pointer">
          <InfoIcon size={20} className="text-gray-600 mb-2" />
          <h4 className="font-mono font-normal text-sm mb-1">FAQs</h4>
        </div>
        <div className="p-4  bg-gray-50 rounded-2xl hover:bg-accent flex flex-col items-center justify-center transition-colors duration-500 cursor-pointer">
          <HeadsetIcon size={20} className="text-gray-600 mb-2" />
          <h4 className="font-mono font-normal text-sm mb-1">Contact Us</h4>
        </div>
        <div className="p-4  bg-gray-50 rounded-2xl hover:bg-accent flex flex-col items-center justify-center transition-colors duration-500 cursor-pointer">
          <MessageSquareReplyIcon size={20} className="text-gray-600 mb-2" />
          <h4 className="font-mono font-normal text-sm mb-1">Feedback</h4>
        </div>
      </div>
    </section>
  );
}
