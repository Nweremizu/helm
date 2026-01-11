import { redirect } from "next/navigation";
import {
  getTransactions,
  getTransactionCategories,
} from "@/lib/actions/transactions";
import LogsClient from "./logs-client";

interface LogsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: string;
  }>;
}

export default async function LogsPage({ searchParams }: LogsPageProps) {
  const params = await searchParams;

  const [result, categories] = await Promise.all([
    getTransactions({
      search: params.q,
      category: params.category,
      type: params.type as "DEBIT" | "CREDIT" | undefined,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      page: Number(params.page) || 1,
    }),
    getTransactionCategories(),
  ]);

  if ("error" in result) {
    if (result.error === "Unauthorized") {
      redirect("/login");
    }
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-800 mb-2">
            Unable to load transactions
          </h2>
          <p className="text-gray-500">{result.error}</p>
        </div>
      </div>
    );
  }

  return <LogsClient initialData={result.data} categories={categories} />;
}
