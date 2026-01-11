"use client";

import { useState, useEffect } from "react";
import {
  TrendUpIcon,
  WarningCircleIcon,
  ChartPieIcon,
  ChartLineIcon,
  SpeedometerIcon,
} from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import { markInsightRead, getUnreadInsights } from "@/lib/actions/sonar";
import type { Insight } from "@/app/generated/prisma/client";
import { formatNaira } from "@/lib/analytics/types";

function getSeverityIcon(severity: string) {
  switch (severity) {
    case "critical":
      return (
        <div className="p-2 bg-red-100 rounded-lg">
          <WarningCircleIcon size={20} className="text-red-600" />
        </div>
      );
    case "warning":
      return (
        <div className="p-2 bg-amber-100 rounded-lg">
          <WarningCircleIcon size={20} className="text-amber-600" />
        </div>
      );
    case "info":
    default:
      return (
        <div className="p-2 bg-blue-100 rounded-lg">
          <WarningCircleIcon size={20} className="text-blue-600" />
        </div>
      );
  }
}

export default function TrendsClient() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [timePeriod, setTimePeriod] = useState("Last 6 Months");

  // Fetch insights on mount
  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setInsightsLoading(true);
    try {
      const result = await getUnreadInsights();
      if ("data" in result && result.data) {
        setInsights(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch insights:", error);
    } finally {
      setInsightsLoading(false);
    }
  };

  const handleDismissInsight = async (
    insightId: string,
    action: "ignore" | "investigate"
  ) => {
    try {
      const result = await markInsightRead(insightId);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setInsights((prev) => prev.filter((i) => i.id !== insightId));
        toast.success(
          action === "investigate" ? "Marked for review" : "Insight dismissed"
        );
      }
    } catch (error) {
      console.error("Failed to dismiss insight:", error);
      toast.error("Failed to dismiss insight");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-sans font-semibold text-gray-900">
            Sonar Intelligence
          </h1>
          <button className="px-4 py-2 text-sm font-mono text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            {timePeriod}
          </button>
        </div>

        {/* Depth Chart */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-sans text-gray-500 mb-1">
                Depth Chart
              </p>
              <p className="text-xs font-mono text-gray-400">
                Net Cash Position
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-mono font-semibold text-gray-900">
                ₦24,500.00
              </p>
              <p className="text-sm font-mono text-green-600 mt-1">
                +8.4% overall
              </p>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="h-48 relative">
            <svg
              className="w-full h-full"
              viewBox="0 0 600 160"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 100 Q 100 90, 150 85 T 300 75 T 450 65 T 600 45"
                stroke="#6366f1"
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M 0 100 Q 100 90, 150 85 T 300 75 T 450 65 T 600 45 L 600 160 L 0 160 Z"
                fill="url(#lineGradient)"
              />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs font-mono text-gray-400 px-2">
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
            </div>
          </div>
        </section>

        {/* Velocity & Composition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Velocity */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <SpeedometerIcon size={20} className="text-red-500" />
              <h2 className="text-sm font-sans font-medium text-gray-700">
                Velocity
              </h2>
            </div>

            <div className="flex items-center justify-center mb-4">
              {/* Gauge */}
              <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    strokeDasharray="188.4 188.4"
                    strokeDashoffset="47.1"
                    transform="rotate(-90 50 50)"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="8"
                    strokeDasharray="188.4 188.4"
                    strokeDashoffset="125.6"
                    transform="rotate(-90 50 50)"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-mono font-bold text-red-500">
                    +15%
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs font-mono text-center text-gray-500 mb-2">
              VS LAST MONTH
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs font-mono text-red-700">
                ⚠️ Running cash faster than usual.
              </p>
            </div>
          </section>

          {/* Composition */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <ChartPieIcon size={20} className="text-green-500" />
              <h2 className="text-sm font-sans font-medium text-gray-700">
                Composition
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: "Food & Dining",
                  amount: 4526900,
                  color: "bg-indigo-500",
                },
                {
                  name: "Housing & Utilities",
                  amount: 2256900,
                  color: "bg-blue-500",
                },
                { name: "Transport", amount: 1826000, color: "bg-cyan-500" },
                {
                  name: "Entertainment",
                  amount: 1246000,
                  color: "bg-teal-500",
                },
              ].map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-gray-700">{cat.name}</span>
                    <span className="font-mono text-gray-900 font-medium">
                      {formatNaira(cat.amount)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color}`}
                      style={{ width: `${(cat.amount / 10000000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Leak Detection */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <WarningCircleIcon size={20} className="text-amber-500" />
            <h2 className="text-sm font-sans font-medium text-gray-700">
              Leak Detection
            </h2>
          </div>

          {insightsLoading ? (
            <div className="py-8 text-center">
              <p className="text-sm font-mono text-gray-400">
                Scanning for anomalies...
              </p>
            </div>
          ) : insights.length === 0 ? (
            <div className="py-8 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm font-sans text-gray-500 font-medium">
                No leaks detected
              </p>
              <p className="text-xs font-mono text-gray-400 mt-1">
                All transactions look normal
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  {getSeverityIcon(insight.severity)}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-sans font-medium text-gray-900 mb-1">
                      {insight.title}
                    </p>
                    <p className="text-xs font-mono text-gray-600">
                      {insight.message}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDismissInsight(insight.id, "ignore")}
                      className="px-3 py-1.5 text-xs font-mono text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                      Ignore
                    </button>
                    <button
                      onClick={() =>
                        handleDismissInsight(insight.id, "investigate")
                      }
                      className="px-3 py-1.5 text-xs font-mono bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition"
                    >
                      {insight.severity === "critical"
                        ? "Investigate"
                        : "Review"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
