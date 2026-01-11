"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  ReceiptIcon,
  CaretLeftIcon,
  CaretRightIcon,
  XIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  TrendUpIcon,
  TrendDownIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/analytics/types";
import type {
  PaginatedTransactions,
  TransactionWithAccount,
} from "@/lib/actions/transactions";

interface LogsClientProps {
  initialData: PaginatedTransactions;
  categories: string[];
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
  });
}

function getMonthKey(date: Date): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthHeader(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-NG", { month: "long", year: "numeric" });
}

interface MonthGroup {
  monthKey: string;
  label: string;
  transactions: TransactionWithAccount[];
  incomeKobo: number;
  expenseKobo: number;
}

function TransactionItem({ tx }: { tx: TransactionWithAccount }) {
  const isCredit = tx.type === "CREDIT";

  return (
    <div className="flex items-center gap-4 group">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
        {isCredit ? (
          <ArrowDownIcon size={18} className="text-green-500" />
        ) : (
          <ArrowUpIcon size={18} className="text-red-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-500 transition">
          {tx.cleanName || tx.originalNarration}
        </p>
        <p className="text-xs text-gray-400 truncate">
          {tx.cleanCategory || "Uncategorized"} • {tx.account.bankName} •{" "}
          {formatDate(tx.date)}
        </p>
      </div>
      <span
        className={`text-sm font-mono font-medium whitespace-nowrap ${
          isCredit ? "text-green-600" : "text-gray-800"
        }`}
      >
        {isCredit ? "+" : "-"}
        {formatNaira(tx.amount)}
      </span>
    </div>
  );
}

export default function LogsClient({
  initialData,
  categories,
}: LogsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "all";
  const currentType = searchParams.get("type") || "";
  const currentDateFrom = searchParams.get("dateFrom") || "";
  const currentDateTo = searchParams.get("dateTo") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(currentSearch);

  const hasFilters =
    currentSearch ||
    currentCategory !== "all" ||
    currentType ||
    currentDateFrom ||
    currentDateTo;

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      if (updates.page === undefined && !("page" in updates)) {
        params.delete("page");
      }

      router.push(`/logs?${params.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== currentSearch) {
        updateFilters({ q: search, page: "" });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, currentSearch, updateFilters]);

  const clearFilters = () => {
    setSearch("");
    router.push("/logs");
  };

  const goToPage = (page: number) => {
    updateFilters({ page: page.toString() });
  };

  const { transactions, pagination, summary } = initialData;

  const monthGroups = useMemo(() => {
    const groups = new Map<string, MonthGroup>();

    for (const tx of transactions) {
      const monthKey = getMonthKey(tx.date);

      if (!groups.has(monthKey)) {
        groups.set(monthKey, {
          monthKey,
          label: formatMonthHeader(monthKey),
          transactions: [],
          incomeKobo: 0,
          expenseKobo: 0,
        });
      }

      const group = groups.get(monthKey)!;
      group.transactions.push(tx);

      if (tx.type === "CREDIT") {
        group.incomeKobo += tx.amount;
      } else {
        group.expenseKobo += tx.amount;
      }
    }

    return Array.from(groups.values()).sort((a, b) =>
      b.monthKey.localeCompare(a.monthKey)
    );
  }, [transactions]);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 pb-24">
        <div className="flex items-center justify-between">
          <h1 className="font-sans text-2xl font-semibold text-primary">
            Transactions
          </h1>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
            >
              <XIcon size={14} />
              Clear all
            </button>
          )}
        </div>

        <section className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <Input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<MagnifyingGlassIcon size={18} className="text-gray-400" />}
            className="mb-4"
          />

          <div className="flex gap-3">
            <select
              value={currentCategory}
              onChange={(e) =>
                updateFilters({ category: e.target.value, page: "" })
              }
              className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-tertiary/50"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={currentType}
              onChange={(e) =>
                updateFilters({ type: e.target.value, page: "" })
              }
              className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-tertiary/50"
            >
              <option value="">All Types</option>
              <option value="CREDIT">Income</option>
              <option value="DEBIT">Expense</option>
            </select>

            <Input
              type="date"
              value={currentDateFrom}
              onChange={(e) =>
                updateFilters({ dateFrom: e.target.value, page: "" })
              }
              className="w-auto"
              size="default"
            />

            <Input
              type="date"
              value={currentDateTo}
              onChange={(e) =>
                updateFilters({ dateTo: e.target.value, page: "" })
              }
              className="w-auto"
              size="default"
            />
          </div>
        </section>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendUpIcon size={18} className="text-green-500" />
              <span className="text-sm text-gray-500">Total Income</span>
            </div>
            <p className="text-xl font-mono font-semibold text-green-600">
              +{formatNaira(summary.totalIncomeKobo)}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendDownIcon size={18} className="text-red-500" />
              <span className="text-sm text-gray-500">Total Expenses</span>
            </div>
            <p className="text-xl font-mono font-semibold text-red-600">
              -{formatNaira(summary.totalExpenseKobo)}
            </p>
          </div>
        </div>

        {/* Transactions grouped by month */}
        {monthGroups.length > 0 ? (
          monthGroups.map((group) => (
            <section
              key={group.monthKey}
              className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sans font-medium text-lg text-gray-800">
                  {group.label}
                </h3>
                <div className="flex items-center gap-4 text-sm font-mono">
                  <span className="text-green-600">
                    +{formatNaira(group.incomeKobo)}
                  </span>
                  <span className="text-red-600">
                    -{formatNaira(group.expenseKobo)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {group.transactions.map((tx, idx) => (
                  <div key={tx.id}>
                    <TransactionItem tx={tx} />
                    {idx < group.transactions.length - 1 && (
                      <div className="h-px bg-gray-100 mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
            <div className="text-center text-neutral-400 py-12">
              <ReceiptIcon size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-base font-medium mb-1">
                No transactions found
              </p>
              <p className="text-sm">
                {hasFilters
                  ? "Try adjusting your filters"
                  : "Link a bank account to see your transactions"}
              </p>
            </div>
          </section>
        )}

        {/* Pagination */}
        {transactions.length > 0 && (
          <div className="flex items-center justify-between px-2">
            <p className="text-sm text-gray-500">
              Page {pagination.page}
              {` • ${transactions.length} transaction${
                transactions.length !== 1 ? "s" : ""
              }`}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <CaretLeftIcon size={16} />
              </Button>
              <span className="text-sm text-gray-600 min-w-20 text-center">
                Page {pagination.page}
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={!pagination.hasMore}
              >
                <CaretRightIcon size={16} />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
