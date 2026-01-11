"use client";

import Cards from "@/components/layout/cards";
import Footer from "@/components/layout/footer";
import HeroLayout from "@/components/layout/hero";
import StatsLayout from "@/components/layout/stats";
import WhatToExpect from "@/components/layout/what-to-expect";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/provider/auth";
export default function HomePage() {
  const { user } = useAuth();

  return (
    <main className="bg-background transition-colors duration-300 overflow-x-hidden">
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md border-b border-neutral-50">
        {/* Navigation content goes here */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex shrink-0">
              <Link href="/">
                <Image
                  src="/Logo.svg"
                  alt="Helm Logo"
                  width={120}
                  height={40}
                />
              </Link>
            </div>
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8 items-center text-sm  text-gray-600">
              <Link
                href="#"
                className="hover:text-gray-900 transition-colors duration-200"
              >
                Overview
              </Link>
              <Link
                href="#"
                className="hover:text-gray-900 transition-colors duration-200"
              >
                Features
              </Link>
              <Link
                href="#"
                className="hover:text-gray-900 transition-colors duration-200"
              >
                Reports
              </Link>
              <Link
                href="#"
                className="hover:text-gray-900 transition-colors duration-200"
              >
                Settings
              </Link>
            </div>
            {/* Call to Action Button */}
            {user ? (
              <Link href="/dashboard">
                <Button variant="default">Dashboard</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button variant="default">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <HeroLayout />
      <WhatToExpect />
      <Cards />
      <StatsLayout />
      <section className="bg-background dark:bg-background-dark py-24 relative overflow-hidden">
        {/* Geometric Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-secondary/20 rounded-bl-full -mr-10 -mt-10 z-0"></div>
        {/* <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-tr-full -ml-10 -mb-10 z-0"></div> */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* --- Header --- */}
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="py-1 px-3 border-2 border-primary rounded-lg text-primary font-bold text-xs uppercase tracking-widest bg-white dark:bg-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                Your Workflow
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-primary dark:text-white mb-6 uppercase leading-[0.9]">
              Simple tools for
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-gray-600 dark:from-white dark:to-gray-400">
                complex finances
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-lg font-medium">
              Whether you prefer hands-off automation or detailed manual
              tracking, we have the right mode for you.
            </p>
          </div>

          {/* --- Cards Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CARD 1: Automated (Dark & Sleek) */}
            <div className="bg-primary text-white rounded-[2rem] p-8 flex flex-col justify-between h-130 overflow-hidden group relative shadow-2xl border-4 border-primary">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/20">
                  {/* Sync Icon */}
                  <svg
                    className="w-6 h-6 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-3xl font-bold mb-2 uppercase leading-tight">
                  Automated
                  <br />
                  Tracking
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Securely link your bank accounts. We categorize every coffee,
                  bill, and deposit instantly.
                </p>
              </div>

              {/* Visual: Connection Animation */}
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-black/40 to-transparent z-0"></div>
              <div className="relative h-40 w-full mt-8 flex items-center justify-center z-10">
                {/* Bank Node */}
                <div className="w-16 h-16 bg-accent z-10 rounded-2xl border border-gray-600 flex items-center justify-center transform -translate-x-12 group-hover:-translate-x-16 transition-transform duration-500">
                  <span className="text-2xl">🏦</span>
                </div>
                {/* App Node */}
                <div className="w-16 h-16 bg-yellow-200 rounded-2xl border border-tertiary/50 flex items-center justify-center transform translate-x-12 group-hover:translate-x-16 transition-transform duration-500 z-10 shadow-lg">
                  <span className="text-2xl">⚡️</span>
                </div>
                {/* Connecting Line (Animated) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-2 bg-linear-to-r from-yellow-100 to-tertiary rounded-full overflow-hidden">
                  <div className="w-full h-full bg-accent-secondary/80 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                </div>
              </div>
            </div>

            {/* CARD 2: Insights (Colored & Informative) */}
            <div className="bg-accent-secondary rounded-[2rem] p-8 flex flex-col justify-between h-130 overflow-hidden relative border-4 border-accent-secondary shadow-xl group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                  {/* Bulb Icon */}
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-3xl font-bold mb-2 uppercase leading-tight text-primary">
                  Smart
                  <br />
                  Insights
                </h3>
                <p className="text-primary/70 text-sm leading-relaxed font-medium">
                  Stop overspending. Get personalized alerts like &quot;You
                  spent 20% more on dining this month.&quot;
                </p>
              </div>

              {/* Visual: Notification Stack */}
              <div className="relative mt-8 flex flex-col items-center space-y-3 transform translate-y-12 group-hover:translate-y-2 transition-transform duration-500 ease-out">
                {/* Notification 1 */}
                <div className="w-full bg-white/90 backdrop-blur rounded-xl p-3 shadow-lg flex items-center gap-3 transform scale-90 opacity-60">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xs font-bold">
                    !
                  </div>
                  <div className="h-2 w-24 bg-gray-200 rounded"></div>
                </div>
                {/* Notification 2 */}
                <div className="w-full bg-white rounded-xl p-4 shadow-xl flex items-center gap-4 border border-white/50 transform group-hover:scale-105 transition-transform duration-300">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-lg">
                    📉
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Weekly Report
                    </p>
                    <p className="text-sm font-bold text-primary">
                      Spending down 15%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: Manual Entry (Clean & Interactive) */}
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 flex flex-col justify-between h-130 overflow-hidden relative border-4 border-gray-100 dark:border-gray-700 hover:border-primary/50 transition-colors duration-300 shadow-lg group">
              <div>
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-6">
                  {/* Edit Icon */}
                  <svg
                    className="w-6 h-6 text-gray-600 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-3xl font-bold mb-2 uppercase leading-tight text-primary dark:text-white">
                  Manual
                  <br />
                  Control
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Prefer to do it yourself? Quickly input cash transactions with
                  our rapid-entry keypad.
                </p>
              </div>

              {/* Visual: Calculator / Keypad */}
              <div className="mt-8 bg-gray-50 dark:bg-gray-900 rounded-t-2xl p-4 pb-0 border-t border-x border-gray-200 dark:border-gray-700 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                {/* Input Screen */}
                <div className="w-full h-12 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg mb-4 flex items-center justify-end px-3">
                  <span className="text-xl font-mono font-bold text-primary dark:text-white border-r-2 border-primary animate-pulse pr-1">
                    $45.00
                  </span>
                </div>
                {/* Keypad Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div
                      key={num}
                      className="h-10 bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center font-bold text-gray-400 text-sm"
                    >
                      {num}
                    </div>
                  ))}
                </div>
                <div className="mt-2 w-full h-10 bg-primary rounded flex items-center justify-center text-white font-bold text-sm uppercase tracking-wide">
                  Add Expense
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
