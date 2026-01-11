"use client";

import { KeelPacingWidget } from "@/components/keep-pacing";
import {
  CalendarIcon,
  ClockCounterClockwiseIcon,
  ArrowsClockwiseIcon,
  WarningCircleIcon,
  ChartPieIcon,
  CheckCircleIcon,
  WarningIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Fragment, useTransition } from "react";
import type { DailySpendingPoint } from "@/lib/analytics/types";
import { formatNaira, koboToNaira } from "@/lib/analytics/types";
import {
  triggerManualSnapshot,
  type ExtendedDashboardMetrics,
} from "@/lib/actions/dashboard";
import type { CategoryCashFlow } from "@/lib/analytics/cash-flow";
import { toast } from "sonner";

interface DashboardClientProps {
  metrics: ExtendedDashboardMetrics;
}

function formatDaysUntil(nextDueDate: Date): string {
  const now = new Date();
  const diff = Math.ceil(
    (nextDueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff < 0) return "Overdue";
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `In ${diff} days`;
}

function getHealthColor(health: "safe" | "warning" | "overspent") {
  switch (health) {
    case "safe":
      return "bg-green-500";
    case "warning":
      return "bg-amber-500";
    case "overspent":
      return "bg-red-500";
  }
}

function getHealthBg(health: "safe" | "warning" | "overspent") {
  switch (health) {
    case "safe":
      return "bg-green-100 text-green-700";
    case "warning":
      return "bg-amber-100 text-amber-700";
    case "overspent":
      return "bg-red-100 text-red-700";
  }
}

function getSafetyLabel(status: "safe" | "caution" | "danger") {
  switch (status) {
    case "safe":
      return "On Track";
    case "caution":
      return "Watch Spending";
    case "danger":
      return "Over Budget";
  }
}

function transformToPacingData(
  dailyVelocity: DailySpendingPoint[],
  statusLabel: string
) {
  const today = new Date().toISOString().split("T")[0];

  return {
    meta: {
      title: "Keep Pacing",
      period: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      status: statusLabel,
      currency: "NGN",
      unit: "",
    },
    series: dailyVelocity.map((point) => ({
      date: point.date,
      value: koboToNaira(Math.abs(point.expenseKobo)),
      status:
        point.date < today
          ? "closed"
          : point.date === today
          ? "active"
          : "projected",
    })),
  };
}

export default function DashboardClient({ metrics }: DashboardClientProps) {
  const [isPending, startTransition] = useTransition();

  const { pulse, recurringBills, dailyVelocity, spendingBreakdown, cashFlow } =
    metrics;

  const safeToSpendNaira = koboToNaira(pulse.safeToSpendKobo);
  const wholePart = Math.floor(safeToSpendNaira);
  const decimalPart = ((safeToSpendNaira % 1) * 100)
    .toFixed(0)
    .padStart(2, "0");

  const upcomingBills = recurringBills
    .filter((bill) => new Date(bill.nextDueDate) > new Date())
    .sort(
      (a, b) =>
        new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime()
    )
    .slice(0, 5);

  const recentTransactions = spendingBreakdown
    .filter((cat) => cat.category !== "Income" && cat.category !== "Transfer")
    .slice(0, 4);

  const topCashFlowCategories = cashFlow?.categories.slice(0, 4) || [];

  const pacingData = transformToPacingData(
    dailyVelocity,
    getSafetyLabel(pulse.safetyStatus)
  );

  const handleRefresh = () => {
    startTransition(async () => {
      const result = await triggerManualSnapshot();
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Dashboard refreshed");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background h-screen ">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col gap-8 pb-8">
        <section id="balance" className="text-center py-8 relative pt-12">
          <div className="inline-flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-mono font-medium text-neutral-400 dark:text-text-dark-secondary uppercase tracking-widest">
                Safe-to-Spend
              </span>
              <button
                onClick={handleRefresh}
                disabled={isPending}
                className="p-1 rounded-full hover:bg-neutral-100 transition-colors disabled:opacity-50"
                aria-label="Refresh dashboard"
              >
                <ArrowsClockwiseIcon
                  size={16}
                  className={`text-neutral-400 ${
                    isPending ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
            <div className="relative">
              <h1 className="text-6xl md:text-8xl font-sans font-medium tracking-tight text-primary">
                ₦{wholePart.toLocaleString()}
                <span className="text-4xl md:text-5xl text-neutral-500 dark:text-gray-600">
                  .{decimalPart}
                </span>
              </h1>
            </div>
            {pulse.daysUntilSalary && (
              <p className="text-sm text-neutral-500 mt-2">
                {pulse.daysUntilSalary} days until salary
              </p>
            )}
          </div>
        </section>

        <section
          id="keep-pacing"
          className="w-full bg-white rounded-3xl p-6 shadow-sm border border-neutral-100"
        >
          {dailyVelocity.length > 0 ? (
            <KeelPacingWidget data={pacingData} />
          ) : (
            <div className="h-48 flex items-center justify-center text-neutral-400">
              <div className="text-center">
                <WarningCircleIcon size={32} className="mx-auto mb-2" />
                <p>No spending data yet</p>
              </div>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section
            id="Horizon"
            className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <CalendarIcon size={20} className="text-blue-400" />
              <h3 className="font-sans font-medium text-lg">Horizon</h3>
            </div>
            <div className="space-y-4 grow">
              {upcomingBills.length > 0 ? (
                upcomingBills.map((bill, index) => (
                  <Fragment key={bill.id}>
                    <div className="flex justify-between items-center group">
                      <div className="flex flex-col">
                        <span className="text-sm font-sans font-medium text-gray-800 group-hover:text-blue-500 transition">
                          {bill.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDaysUntil(new Date(bill.nextDueDate))}
                        </span>
                      </div>
                      <span className="text-sm font-mono font-medium text-gray-800 group-hover:text-blue-500 transition">
                        {formatNaira(bill.amountKobo)}
                      </span>
                    </div>
                    {index < upcomingBills.length - 1 && (
                      <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />
                    )}
                  </Fragment>
                ))
              ) : (
                <div className="text-center text-neutral-400 py-8">
                  <CalendarIcon size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No upcoming bills detected</p>
                </div>
              )}
            </div>
            {upcomingBills.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total upcoming</span>
                  <span className="font-mono font-medium text-gray-800">
                    {formatNaira(pulse.upcomingBillsKobo)}
                  </span>
                </div>
              </div>
            )}
          </section>

          <section className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
            <div className="flex items-center gap-2 mb-6">
              <ClockCounterClockwiseIcon
                size={20}
                className="text-purple-400"
              />
              <h3 className="font-sans font-medium text-lg">Spending</h3>
            </div>
            <div className="space-y-5 grow">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((category) => (
                  <Fragment key={category.category}>
                    <div className="flex justify-between items-center group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 font-medium">
                            {category.category.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-primary font-sans">
                            {category.category}
                          </div>
                          <div className="text-xs text-gray-400">
                            {category.transactionCount} transactions •{" "}
                            {category.percentage.toFixed(0)}%
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-mono font-medium text-gray-800 group-hover:text-purple-500 transition">
                        {formatNaira(category.amountKobo)}
                      </span>
                    </div>
                  </Fragment>
                ))
              ) : (
                <div className="text-center text-neutral-400 py-8">
                  <ClockCounterClockwiseIcon
                    size={32}
                    className="mx-auto mb-2 opacity-50"
                  />
                  <p className="text-sm">No spending data yet</p>
                </div>
              )}
            </div>
            {recentTransactions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Avg. daily spend</span>
                  <span className="font-mono font-medium text-gray-800">
                    {formatNaira(pulse.avgDailySpendKobo)}
                  </span>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Cash Flow Section */}
        {cashFlow && cashFlow.categories.length > 0 && (
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ChartPieIcon size={20} className="text-teal-500" />
                <h3 className="font-sans font-medium text-lg">Cash Flow</h3>
              </div>
              <Link
                href="/plan"
                className="text-xs text-gray-400 hover:text-teal-500 transition"
              >
                Manage plan →
              </Link>
            </div>

            {/* Summary Bar */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Monthly Surplus</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    cashFlow.surplusKobo >= 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {formatNaira(Math.abs(cashFlow.surplusKobo))}
                </span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                    cashFlow.surplusKobo >= 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      (Math.abs(cashFlow.surplusKobo) /
                        Math.max(cashFlow.incomeKobo, 1)) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>Income: {formatNaira(cashFlow.incomeKobo)}</span>
                <span>Expenses: {formatNaira(cashFlow.expenseKobo)}</span>
              </div>
            </div>

            {/* Category Gauges */}
            <div className="space-y-4">
              {topCashFlowCategories.map((cat) => (
                <div key={cat.category} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {cat.category}
                      </span>
                      <div className="flex items-center gap-2">
                        {cat.health === "overspent" && (
                          <WarningIcon size={14} className="text-red-500" />
                        )}
                        {cat.health === "safe" && cat.percentage < 50 && (
                          <CheckCircleIcon
                            size={14}
                            className="text-green-500"
                          />
                        )}
                        <span className="text-xs text-gray-500">
                          {formatNaira(cat.spentKobo)} /{" "}
                          {formatNaira(cat.budgetKobo)}
                        </span>
                      </div>
                    </div>
                    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full transition-all ${getHealthColor(
                          cat.health
                        )}`}
                        style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cashFlow.unbudgetedCategories.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-amber-600 mb-2">
                  {cashFlow.unbudgetedCategories.length} unbudgeted{" "}
                  {cashFlow.unbudgetedCategories.length === 1
                    ? "category"
                    : "categories"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cashFlow.unbudgetedCategories.slice(0, 3).map((u) => (
                    <span
                      key={u.category}
                      className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full"
                    >
                      {u.category}: {formatNaira(u.spentKobo)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {!cashFlow ||
          (cashFlow.categories.length === 0 && (
            <section className="bg-linear-to-br from-teal-50 to-emerald-50 rounded-3xl p-6 border border-teal-100">
              <div className="text-center">
                <ChartPieIcon
                  size={40}
                  className="mx-auto mb-3 text-teal-500"
                />
                <h3 className="font-medium text-gray-800 mb-1">
                  Set up your budget
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Create a spending plan and track your progress towards
                  financial goals.
                </p>
                <Link
                  href="/plan"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-full hover:bg-teal-600 transition"
                >
                  Get Started
                </Link>
              </div>
            </section>
          ))}
      </main>
    </div>
  );
}
