"use server";

import { getUser } from "@/lib/auth/dal";
import { prisma } from "@/prisma/db";
import type { Prisma } from "@/app/generated/prisma/client";

export interface TransactionFilters {
  search?: string;
  category?: string;
  type?: "DEBIT" | "CREDIT";
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface TransactionWithAccount {
  id: string;
  amount: number;
  type: "DEBIT" | "CREDIT";
  status: "PENDING" | "CLEARED" | "FAILED";
  date: Date;
  balance: number | null;
  currency: string;
  originalNarration: string;
  cleanName: string | null;
  cleanCategory: string | null;
  icon: string | null;
  isRecurring: boolean;
  account: {
    bankName: string;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface TransactionSummary {
  totalIncomeKobo: number;
  totalExpenseKobo: number;
  netKobo: number;
}

export interface PaginatedTransactions {
  transactions: TransactionWithAccount[];
  pagination: PaginationInfo;
  summary: TransactionSummary;
}

export async function getTransactions(
  filters: TransactionFilters
): Promise<{ data: PaginatedTransactions } | { error: string }> {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const {
    page = 1,
    limit = 20,
    search,
    category,
    type,
    dateFrom,
    dateTo,
  } = filters;

  const where: Prisma.TransactionWhereInput = {
    userId: user.id,
    ...(search && {
      OR: [
        { cleanName: { contains: search, mode: "insensitive" } },
        { originalNarration: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(category && category !== "all" && { cleanCategory: category }),
    ...(type && { type }),
    ...(dateFrom && { date: { gte: new Date(dateFrom) } }),
    ...(dateTo && {
      date: { lte: new Date(new Date(dateTo).setHours(23, 59, 59, 999)) },
    }),
  };

  try {
    // Fetch transactions and aggregates in parallel
    const [transactions, incomeAgg, expenseAgg] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit + 1,
        select: {
          id: true,
          amount: true,
          type: true,
          status: true,
          date: true,
          balance: true,
          currency: true,
          originalNarration: true,
          cleanName: true,
          cleanCategory: true,
          icon: true,
          isRecurring: true,
          account: {
            select: { bankName: true },
          },
        },
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: "CREDIT" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: "DEBIT" },
        _sum: { amount: true },
      }),
    ]);

    const hasMore = transactions.length > limit;
    const items = hasMore ? transactions.slice(0, limit) : transactions;

    const totalIncomeKobo = incomeAgg._sum.amount || 0;
    const totalExpenseKobo = expenseAgg._sum.amount || 0;

    return {
      data: {
        transactions: items as TransactionWithAccount[],
        pagination: {
          page,
          limit,
          hasMore,
        },
        summary: {
          totalIncomeKobo,
          totalExpenseKobo,
          netKobo: totalIncomeKobo - totalExpenseKobo,
        },
      },
    };
  } catch (error) {
    console.error("[Transactions] Failed to fetch:", error);
    return { error: "Failed to load transactions" };
  }
}

export async function getTransactionCategories(): Promise<string[]> {
  const user = await getUser();
  if (!user) return [];

  try {
    const categories = await prisma.transaction.findMany({
      where: { userId: user.id, cleanCategory: { not: null } },
      select: { cleanCategory: true },
      distinct: ["cleanCategory"],
    });

    return categories
      .map((c) => c.cleanCategory)
      .filter((c): c is string => c !== null)
      .sort();
  } catch {
    return [];
  }
}
