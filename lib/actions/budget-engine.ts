"use server";

import { getUser } from "@/lib/auth/dal";
import { prisma } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export interface AnchorItem {
  id: string;
  category: string;
  amountKobo: number;
  isActive: boolean;
  icon: string | null;
  color: string | null;
}

export interface VariableItem {
  id: string;
  category: string;
  amountKobo: number;
  icon: string | null;
  color: string | null;
}

export interface BudgetState {
  incomeKobo: number;
  anchors: AnchorItem[];
  variables: VariableItem[];
  totalAllocatedKobo: number;
  surplusKobo: number;
}

export async function getBudgetState(): Promise<
  { data: BudgetState } | { error: string }
> {
  const authUser = await getUser();
  if (!authUser) return { error: "Unauthorized" };

  try {
    const [dbUser, budgetPlans] = await Promise.all([
      prisma.user.findUnique({
        where: { id: authUser.id },
        select: { monthlyIncomeTarget: true },
      }),
      prisma.budgetPlan.findMany({
        where: { userId: authUser.id },
        orderBy: { category: "asc" },
      }),
    ]);

    const anchors: AnchorItem[] = budgetPlans
      .filter((p) => p.type === "ANCHOR")
      .map((p) => ({
        id: p.id,
        category: p.category,
        amountKobo: Math.round(Number(p.limitAmount) * 100),
        isActive: Number(p.limitAmount) > 0,
        icon: p.icon,
        color: p.color,
      }));

    const variables: VariableItem[] = budgetPlans
      .filter((p) => p.type === "VARIABLE")
      .map((p) => ({
        id: p.id,
        category: p.category,
        amountKobo: Math.round(Number(p.limitAmount) * 100),
        icon: p.icon,
        color: p.color,
      }));

    const incomeKobo = dbUser?.monthlyIncomeTarget || 0;
    const anchorsTotal = anchors.reduce((sum, a) => sum + a.amountKobo, 0);
    const variablesTotal = variables.reduce((sum, v) => sum + v.amountKobo, 0);
    const totalAllocatedKobo = anchorsTotal + variablesTotal;
    const surplusKobo = incomeKobo - totalAllocatedKobo;

    return {
      data: {
        incomeKobo,
        anchors,
        variables,
        totalAllocatedKobo,
        surplusKobo,
      },
    };
  } catch (error) {
    console.error("[BudgetEngine] Failed to get state:", error);
    return { error: "Failed to load budget state" };
  }
}

export async function updateIncomeTarget(
  amountKobo: number
): Promise<{ success: boolean } | { error: string }> {
  const user = await getUser();
  if (!user) return { error: "Unauthorized" };

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { monthlyIncomeTarget: Math.max(0, Math.round(amountKobo)) },
    });

    revalidatePath("/plan");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("[BudgetEngine] Failed to update income:", error);
    return { error: "Failed to update income target" };
  }
}

export async function upsertBudgetCategory(
  category: string,
  amountKobo: number,
  type: "ANCHOR" | "VARIABLE"
): Promise<{ success: boolean; id: string } | { error: string }> {
  const user = await getUser();
  if (!user) return { error: "Unauthorized" };

  const amountNaira = amountKobo / 100;

  try {
    const result = await prisma.budgetPlan.upsert({
      where: {
        userId_category: { userId: user.id, category },
      },
      update: {
        limitAmount: amountNaira,
        type,
      },
      create: {
        userId: user.id,
        category,
        limitAmount: amountNaira,
        type,
      },
    });

    revalidatePath("/plan");
    revalidatePath("/dashboard");
    return { success: true, id: result.id };
  } catch (error) {
    console.error("[BudgetEngine] Failed to upsert category:", error);
    return { error: "Failed to save budget category" };
  }
}

export async function deleteBudgetCategory(
  category: string
): Promise<{ success: boolean } | { error: string }> {
  const user = await getUser();
  if (!user) return { error: "Unauthorized" };

  try {
    await prisma.budgetPlan.deleteMany({
      where: { userId: user.id, category },
    });

    revalidatePath("/plan");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("[BudgetEngine] Failed to delete category:", error);
    return { error: "Failed to delete budget category" };
  }
}
