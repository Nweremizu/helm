import { getBudgetState } from "@/lib/actions/budget-engine";
import { detectAnchors } from "@/lib/analytics/anchor-detector";
import { getUser } from "@/lib/auth/dal";
import PlanClient from "./plan-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Plan | Helm",
  description: "Zero-based budgeting - allocate every naira of your income",
};

export default async function PlanPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const result = await getBudgetState();

  if ("error" in result) {
    throw new Error(result.error);
  }

  const suggestedAnchors = await detectAnchors(user.id);

  return (
    <PlanClient
      initialState={result.data}
      suggestedAnchors={suggestedAnchors}
    />
  );
}
