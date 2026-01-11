import { getDashboardMetrics } from "@/lib/actions/dashboard";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const result = await getDashboardMetrics();

  if ("error" in result) {
    if (result.error === "Unauthorized") {
      redirect("/login");
    }
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-800 mb-2">
            Unable to load dashboard
          </h2>
          <p className="text-gray-500">{result.error}</p>
        </div>
      </div>
    );
  }

  return <DashboardClient metrics={result.data} />;
}
