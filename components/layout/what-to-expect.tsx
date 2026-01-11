import { Button } from "@/components/ui/button";

export default function WhatToExpect() {
  return (
    <section className="bg-primary text-secondary py-24 rounded-t-[3rem] mt-8 relative z-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* --- LEFT COLUMN: Typography --- */}
          <div className="flex flex-col justify-center">
            {/* Eyebrow Label */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-primary font-bold tracking-widest uppercase text-xs">
                Overview
              </span>
            </div>

            {/* Main Headline - High Contrast, Solid Colors */}
            <h2 className="text-5xl md:text-6xl font-black leading-[1.1] text-secondary dark:text-white mb-6 uppercase tracking-tight">
              Your complete <br />
              <span className="text-secondary decoration-4 underline decoration-tertiary underline-offset-4">
                financial picture
              </span>{" "}
              <br />
              at a glance
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-400 dark:text-gray-400 max-w-md leading-relaxed border-l-4 border-tertiary pl-6 mb-8">
              Stop guessing. See your monthly goals, savings, and spending
              habits in one high-contrast dashboard.
            </p>

            {/* Solid Button (No Gradients) */}
            <div>
              <Button
                variant={"ghost"}
                className="group relative inline-flex items-center justify-center px-8! py-4 font-bold text-white transition-all duration-200 bg-primary font-lg rounded-xl focus:outline-none ring-offset-2 focus:ring-2 ring-primary"
              >
                <span>Open Dashboard</span>
                <svg
                  className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  ></path>
                </svg>
              </Button>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Visual Widget --- */}
          {/* Using bg-tertiary as a solid backdrop, no blurs */}
          <div className="relative h-96 bg-tertiary rounded-[3rem] flex items-center justify-center overflow-visible group">
            {/* Decorative Pattern (Subtle dots or lines for texture without gradient) */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            ></div>

            {/* The Interactive Card */}
            <div className="relative w-64 bg-background dark:bg-gray-900 border-4 border-primary rounded-3xl p-6 shadow-2xl transform -rotate-6 group-hover:rotate-0 group-hover:scale-105 transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]">
              {/* Card Header */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                <span className="font-bold text-gray-900 dark:text-white uppercase text-sm tracking-wider">
                  Monthly Goal
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>

              {/* High Contrast Donut Chart */}
              <div className="relative flex items-center justify-center mb-6">
                {/* SVG Circle for crisp lines */}
                <svg className="w-32 h-32 transform -rotate-90">
                  {/* Track */}
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-tertiary/30"
                  />
                  {/* Progress (Solid Primary Color) */}
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray="351.86"
                    strokeDashoffset="87.96"
                    className="text-primary"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Centered Percentage */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-black text-gray-900 dark:text-white">
                    75%
                  </span>
                </div>
              </div>

              {/* Mini Stats Row */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-tertiary/20 rounded-lg p-2">
                  <span className="block text-[10px] uppercase font-bold text-gray-500">
                    Target
                  </span>
                  <span className="block text-sm font-bold text-gray-900 dark:text-white">
                    $5k
                  </span>
                </div>
                <div className="bg-primary/10 rounded-lg p-2">
                  <span className="block text-[10px] uppercase font-bold text-primary">
                    Saved
                  </span>
                  <span className="block text-sm font-bold text-primary">
                    $3.7k
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Decoration Badge behind */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white dark:bg-gray-800 border-4 border-gray-900 dark:border-gray-600 rounded-full flex items-center justify-center shadow-lg z-20 group-hover:-translate-y-2 transition-transform duration-500 delay-75">
              <span className="text-3xl">🎯</span>
            </div>
          </div>
        </div>
        {/* Second Grid Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card-dark border border-gray-700 rounded-3xl p-6 relative overflow-hidden h-96 group hover:border-tertiary transition">
            <div className="absolute top-6 left-6 z-10">
              <span className="bg-primary border border-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-gray-300">
                Income
              </span>
            </div>
            <div className="mt-12">
              <div className="text-2xl font-mono mb-4 text-green-400">
                +$4,250.00
              </div>
              <div className="flex items-end gap-2 h-40 mt-8 px-2">
                <div className="w-1/6 bg-gray-600 h-[40%] rounded-t-sm group-hover:bg-tertiary transition-colors duration-300"></div>
                <div className="w-1/6 bg-gray-600 h-[70%] rounded-t-sm group-hover:bg-tertiary transition-colors duration-500"></div>
                <div className="w-1/6 bg-gray-600 h-[50%] rounded-t-sm group-hover:bg-tertiary transition-colors duration-300"></div>
                <div className="w-1/6 bg-gray-600 h-[90%] rounded-t-sm group-hover:bg-tertiary transition-colors duration-700"></div>
                <div className="w-1/6 bg-gray-600 h-[60%] rounded-t-sm group-hover:bg-tertiary transition-colors duration-300"></div>
                <div className="w-1/6 bg-gray-600 h-[80%] rounded-t-sm group-hover:bg-tertiary transition-colors duration-500"></div>
              </div>
            </div>
          </div>
          <div className="bg-card-dark border border-gray-700 rounded-3xl p-6 relative overflow-hidden h-96 group hover:border-tertiary transition">
            <div className="absolute top-6 right-6 z-10">
              <span className="bg-primary border border-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-gray-300">
                Savings
              </span>
            </div>
            <div className="h-full flex flex-col justify-end items-center relative">
              <div className="relative z-10 w-full flex justify-center items-end gap-2 mb-4">
                <div className="w-16 h-16 bg-white/5 backdrop-blur rounded-xl border border-white/10 flex flex-col items-center justify-center p-2">
                  <div className="w-8 h-2 bg-tertiary rounded-full mb-1 shadow-sm"></div>
                  <div className="w-8 h-2 bg-tertiary rounded-full mb-1 shadow-sm"></div>
                  <div className="w-8 h-2 bg-tertiary rounded-full shadow-sm"></div>
                </div>
                <div className="w-16 h-24 bg-white/5 backdrop-blur rounded-xl border border-white/10 flex flex-col items-center justify-end p-2 pb-4">
                  <div className="w-8 h-2 bg-tertiary rounded-full mb-1 shadow-sm"></div>
                  <div className="w-8 h-2 bg-tertiary rounded-full mb-1 shadow-sm"></div>
                  <div className="w-8 h-2 bg-tertiary rounded-full mb-1 shadow-sm"></div>
                  <div className="w-8 h-2 bg-tertiary rounded-full shadow-sm"></div>
                </div>
              </div>
              <svg
                className="absolute bottom-20 left-0 w-full h-24 stroke-tertiary fill-none stroke-2"
                preserveAspectRatio="none"
                viewBox="0 0 100 50"
              >
                <path d="M0,50 Q25,40 50,20 T100,10"></path>
              </svg>
            </div>
          </div>
          <div className="bg-secondary rounded-3xl p-6 relative overflow-hidden h-96 flex flex-col">
            <div className="flex justify-between items-center mb-6 text-primary">
              <span className="font-bold uppercase tracking-wider text-sm">
                Recent Expenses
              </span>
            </div>
            <div className="bg-surface-light rounded-xl p-4 shadow-xl grow flex flex-col gap-3 transform translate-y-4 group-hover:translate-y-2 transition duration-300 border border-gray-100">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <div className="font-bold text-primary text-sm">-$124.50</div>
                <div className="text-xs text-gray-500">Groceries</div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-primary-hover rounded w-full"></div>
                <div className="h-2 bg-primary-hover rounded w-[90%]"></div>
                <div className="h-2 bg-primary-hover rounded w-[75%]"></div>
                <div className="h-2 bg-primary-hover rounded w-[80%]"></div>
                <div className="h-2 bg-primary-hover rounded w-[60%]"></div>
              </div>
              <div className="mt-auto flex justify-center">
                <div className="w-16 h-2 bg-primary/20 rounded-full"></div>
              </div>
            </div>
            <div className="mt-8 text-sm text-primary/70 leading-relaxed font-medium">
              Visualize where your money goes and identify opportunities to save
              more each month.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
