/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import Silk from "@/components/ui/silk-bg";
import {
  Wallet,
  TrendUp,
  CreditCard,
  CheckCircle,
  ArrowRight,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr";

export default function HeroLayout() {
  return (
    <header className="relative overflow-hidden py-24 lg:py-32 bg-background-light dark:bg-background-dark">
      {/* --- Background Elements --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex justify-center">
        {/* --- LEFT VISUAL: The Dashboard Phone --- */}
        <div className="hidden xl:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 perspective-[1000px]">
          <div className="relative w-72 h-137.5 transform -rotate-12 hover:rotate-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group">
            {/* Phone Body */}
            <div className="relative w-full h-full bg-gray-900 rounded-[3rem] shadow-2xl border-[6px] border-gray-800 ring-1 ring-white/20 overflow-hidden">
              {/* Screen */}
              <div className="w-full h-full bg-white dark:bg-gray-950 relative flex flex-col">
                {/* Status Bar */}
                <div className="h-8 w-full flex justify-between px-6 items-center mt-2">
                  <div className="text-[10px] font-bold">9:41</div>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-black/20 dark:bg-white/20"></div>
                    <div className="w-3 h-3 rounded-full bg-black/20 dark:bg-white/20"></div>
                  </div>
                </div>

                {/* App Content */}
                <div className="p-6 flex-1 flex flex-col gap-6">
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Total Balance</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        $14,250.00
                      </h3>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <TrendUp weight="bold" />
                    </div>
                  </div>

                  {/* Main Card Graphic */}
                  <div className="w-full h-40 bg-primary rounded-2xl relative overflow-hidden p-4 text-white shadow-lg">
                    <div className="absolute inset-0 opacity-30">
                      <Silk />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div className="flex justify-between">
                        <Wallet weight="fill" size={24} />
                        <span className="font-mono opacity-70">**** 4291</span>
                      </div>
                      <div>
                        <p className="text-xs opacity-70 uppercase">
                          Card Holder
                        </p>
                        <p className="font-medium">Alex Morgan</p>
                      </div>
                    </div>
                  </div>

                  {/* Notification Toast (Animated) */}
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 flex items-center gap-3 animate-pulse">
                    <div className="bg-green-500 text-white rounded-full p-1">
                      <CheckCircle weight="fill" size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-700 dark:text-green-400">
                        Payment Successful
                      </p>
                      <p className="text-[10px] text-green-600 dark:text-green-500">
                        You sent $250 to Sarah
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Nav */}
                <div className="h-16 border-t border-gray-100 dark:border-gray-800 flex justify-around items-center text-gray-400">
                  <div className="text-primary">
                    <Wallet weight="fill" size={24} />
                  </div>
                  <div className="hover:text-gray-600">
                    <TrendUp weight="bold" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Glow Behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/30 blur-[80px] -z-10"></div>
          </div>
        </div>

        {/* --- CENTER: Main Text Content --- */}
        <div className="text-center max-w-2xl mx-auto relative z-20 pt-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-tertiary/20 text-primary text-xs font-bold uppercase tracking-wider mb-8 hover:bg-primary/10 transition-colors cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            v2.0 Now Live
            <CaretRight weight="bold" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 uppercase leading-[0.9]">
            Master your money <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-200  to-tertiary animate-gradient-x">
              with clarity
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            Stop guessing where your money goes. Track spending, set budgets,
            and achieve your financial goals with our intelligent dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="default"
              className="px-8! py-4! rounded-full text-lg font-bold "
            >
              Get Started Free
              <ArrowRight weight="bold" className="ml-2" />
            </Button>
            <Button
              variant="outline"
              className="px-8! py-4! rounded-full text-lg font-medium "
            >
              View Demo
            </Button>
          </div>

          {/* Social Proof / Trust */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col items-center gap-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Trusted by 10,000+ users
            </p>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500 overflow-hidden`}
                >
                  <img
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="User"
                  />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                +2k
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT VISUAL: The Card Stack --- */}
        <div className="hidden xl:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-24">
          <div className="relative w-96 h-64 group perspective-[1000px]">
            {/* Card 1: The Back (Eco Green) */}
            <div className="absolute inset-0 bg-linear-to-br from-teal-600 to-teal-900 rounded-2xl shadow-xl border border-white/10 p-6 text-white transform rotate-15 group-hover:rotate-30 group-hover:translate-x-12 group-hover:-translate-y-8 transition-all duration-500 ease-out origin-bottom-left z-10">
              <div className="flex justify-between items-start opacity-50">
                <CreditCard size={32} />
                <span className="text-xs tracking-widest">ECO SAVER</span>
              </div>
            </div>

            {/* Card 2: The Middle (Gold/Tertiary) */}
            <div className="absolute inset-0 bg-linear-to-br from-tertiary to-orange-600 rounded-2xl shadow-xl border border-white/10 p-6 text-white transform rotate-8 group-hover:rotate-12 group-hover:translate-x-6 group-hover:-translate-y-4 transition-all duration-500 ease-out origin-bottom-left z-20">
              <div className="flex justify-between items-start">
                <div className="w-10 h-7 bg-yellow-400/80 rounded flex items-center justify-center">
                  <div className="w-6 h-px bg-black/20"></div>
                </div>
                <span className="font-mono text-sm opacity-80">GOLD</span>
              </div>
              <div className="mt-8 font-mono text-lg tracking-widest">
                •••• 8842
              </div>
            </div>

            {/* Card 3: The Front (Primary Black/Blue) */}
            <div className="absolute inset-0 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6 text-white transform rotate-0 transition-all duration-500 ease-out z-30 flex flex-col justify-between">
              {/* Gloss Effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>

              <div className="flex justify-between items-start">
                <Wallet weight="fill" size={32} className="text-primary" />
                <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded border border-white/10">
                  PREMIUM
                </span>
              </div>

              <div>
                <div className="font-mono text-xl tracking-widest mb-2 text-shadow-sm">
                  $24,500
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <span>Total Balance</span>
                  <span>Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
