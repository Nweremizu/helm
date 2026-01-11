"use client";

import { useState, useCallback, useTransition } from "react";
import {
  AnchorIcon,
  SlidersHorizontalIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  LightningIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatNaira, koboToNaira, nairaToKobo } from "@/lib/analytics/types";
import { toast } from "sonner";
import {
  updateIncomeTarget,
  upsertBudgetCategory,
  deleteBudgetCategory,
  type BudgetState,
  type AnchorItem,
  type VariableItem,
} from "@/lib/actions/budget-engine";
import type { SuggestedAnchor } from "@/lib/analytics/anchor-detector";

interface PlanClientProps {
  initialState: BudgetState;
  suggestedAnchors: SuggestedAnchor[];
}

const CATEGORY_OPTIONS = [
  "Rent",
  "Utilities",
  "Transport",
  "Food & Dining",
  "Groceries",
  "Entertainment",
  "Shopping",
  "Health",
  "Education",
  "Subscription",
  "Insurance",
  "Investment",
  "Other",
];

function AllocationBar({
  incomeKobo,
  allocatedKobo,
}: {
  incomeKobo: number;
  allocatedKobo: number;
}) {
  const percentage = incomeKobo > 0 ? (allocatedKobo / incomeKobo) * 100 : 0;
  const leftKobo = incomeKobo - allocatedKobo;
  const isOver = leftKobo < 0;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
      <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${
            isOver
              ? "bg-red-500"
              : percentage > 80
              ? "bg-amber-500"
              : "bg-green-500"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        {isOver && (
          <div
            className="absolute inset-y-0 right-0 bg-red-500/30 animate-pulse"
            style={{
              width: `${Math.min(
                Math.abs((leftKobo / incomeKobo) * 100),
                20
              )}%`,
            }}
          />
        )}
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">
          Allocated:{" "}
          <span className="font-mono font-medium text-gray-800">
            {formatNaira(allocatedKobo)}
          </span>
        </span>
        <span className={isOver ? "text-red-600" : "text-green-600"}>
          {isOver ? "Over by: " : "Left: "}
          <span className="font-mono font-medium">
            {formatNaira(Math.abs(leftKobo))}
          </span>
        </span>
      </div>
    </div>
  );
}

function AnchorSection({
  anchors,
  suggestedAnchors,
  onUpdate,
  onDelete,
  onAddSuggested,
}: {
  anchors: AnchorItem[];
  suggestedAnchors: SuggestedAnchor[];
  onUpdate: (category: string, amountKobo: number) => void;
  onDelete: (category: string) => void;
  onAddSuggested: (anchor: SuggestedAnchor) => void;
}) {
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = () => {
    if (!newCategory || !newAmount) return;
    onUpdate(newCategory, nairaToKobo(parseFloat(newAmount)));
    setNewCategory("");
    setNewAmount("");
    setShowAdd(false);
  };

  const unusedSuggestions = suggestedAnchors.filter(
    (s) =>
      !anchors.some(
        (a) => a.category === s.category || a.category === s.merchantName
      )
  );

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AnchorIcon size={20} className="text-blue-500" />
          <h3 className="font-sans font-medium text-lg">Fixed Expenses</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowAdd(!showAdd)}>
          <PlusIcon size={16} />
          Add
        </Button>
      </div>

      {showAdd && (
        <div className="flex gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm"
          >
            <option value="">Select category</option>
            {CATEGORY_OPTIONS.filter(
              (c) => !anchors.some((a) => a.category === c)
            ).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <Input
            type="number"
            placeholder="Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="w-32"
          />
          <Button size="icon-sm" onClick={handleAdd}>
            <CheckIcon size={16} />
          </Button>
        </div>
      )}

      {unusedSuggestions.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-600 mb-2 flex items-center gap-1">
            <LightningIcon size={14} />
            Suggested from your history
          </p>
          <div className="flex flex-wrap gap-2">
            {unusedSuggestions.slice(0, 3).map((s) => (
              <button
                key={s.merchantName}
                onClick={() => onAddSuggested(s)}
                className="text-xs px-3 py-1.5 bg-white rounded-full border border-blue-200 hover:bg-blue-100 transition"
              >
                {s.merchantName} • {formatNaira(s.avgAmountKobo)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {anchors.map((anchor) => (
          <div key={anchor.id} className="flex items-center gap-3 group">
            <CheckIcon size={18} className="text-green-500" />
            <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm font-medium text-gray-800">
                {anchor.category}
              </span>
              <span className="font-mono text-sm text-gray-600">
                {formatNaira(anchor.amountKobo)}
              </span>
            </div>
            <button
              onClick={() => onDelete(anchor.category)}
              className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition"
            >
              <TrashIcon size={16} />
            </button>
          </div>
        ))}
        {anchors.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No fixed expenses yet. Add rent, insurance, or subscriptions.
          </p>
        )}
      </div>
    </div>
  );
}

function VariableSection({
  variables,
  leftToAllocate,
  onUpdate,
  onDelete,
}: {
  variables: VariableItem[];
  leftToAllocate: number;
  onUpdate: (category: string, amountKobo: number) => void;
  onDelete: (category: string) => void;
}) {
  const [newCategory, setNewCategory] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = () => {
    if (!newCategory) return;
    onUpdate(newCategory, 0);
    setNewCategory("");
    setShowAdd(false);
  };

  const maxSlider =
    Math.max(leftToAllocate, ...variables.map((v) => v.amountKobo)) + 5000000;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontalIcon size={20} className="text-purple-500" />
          <h3 className="font-sans font-medium text-lg">Variable Spending</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowAdd(!showAdd)}>
          <PlusIcon size={16} />
          Add
        </Button>
      </div>

      {showAdd && (
        <div className="flex gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm"
          >
            <option value="">Select category</option>
            {CATEGORY_OPTIONS.filter(
              (c) => !variables.some((v) => v.category === c)
            ).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <Button size="icon-sm" onClick={handleAdd}>
            <CheckIcon size={16} />
          </Button>
        </div>
      )}

      <div className="space-y-5">
        {variables.map((variable) => (
          <div key={variable.id} className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-800">
                {variable.category}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-gray-600">
                  {formatNaira(variable.amountKobo)}
                </span>
                <button
                  onClick={() => onDelete(variable.category)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition"
                >
                  <TrashIcon size={14} />
                </button>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={maxSlider}
              step={1000}
              value={variable.amountKobo}
              onChange={(e) =>
                onUpdate(variable.category, parseInt(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        ))}
        {variables.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No variable budgets yet. Add food, entertainment, or shopping.
          </p>
        )}
      </div>
    </div>
  );
}

export default function PlanClient({
  initialState,
  suggestedAnchors,
}: PlanClientProps) {
  const [state, setState] = useState<BudgetState>(initialState);
  const [isPending, startTransition] = useTransition();
  const [incomeInput, setIncomeInput] = useState(
    initialState.incomeKobo > 0
      ? koboToNaira(initialState.incomeKobo).toString()
      : ""
  );

  const recalculateTotals = useCallback(
    (newState: Partial<BudgetState>) => {
      const anchors = newState.anchors || state.anchors;
      const variables = newState.variables || state.variables;
      const incomeKobo = newState.incomeKobo ?? state.incomeKobo;

      const anchorsTotal = anchors.reduce((sum, a) => sum + a.amountKobo, 0);
      const variablesTotal = variables.reduce(
        (sum, v) => sum + v.amountKobo,
        0
      );
      const totalAllocatedKobo = anchorsTotal + variablesTotal;

      return {
        ...state,
        ...newState,
        totalAllocatedKobo,
        surplusKobo: incomeKobo - totalAllocatedKobo,
      };
    },
    [state]
  );

  const handleIncomeBlur = () => {
    const amountKobo = nairaToKobo(parseFloat(incomeInput) || 0);
    setState(recalculateTotals({ incomeKobo: amountKobo }));

    startTransition(async () => {
      const result = await updateIncomeTarget(amountKobo);
      if ("error" in result) {
        toast.error(result.error);
      }
    });
  };

  const handleAnchorUpdate = (category: string, amountKobo: number) => {
    const existing = state.anchors.find((a) => a.category === category);
    const newAnchors = existing
      ? state.anchors.map((a) =>
          a.category === category ? { ...a, amountKobo } : a
        )
      : [
          ...state.anchors,
          {
            id: crypto.randomUUID(),
            category,
            amountKobo,
            isActive: true,
            icon: null,
            color: null,
          },
        ];

    setState(recalculateTotals({ anchors: newAnchors }));

    startTransition(async () => {
      const result = await upsertBudgetCategory(category, amountKobo, "ANCHOR");
      if ("error" in result) {
        toast.error(result.error);
      }
    });
  };

  const handleAnchorDelete = (category: string) => {
    const newAnchors = state.anchors.filter((a) => a.category !== category);
    setState(recalculateTotals({ anchors: newAnchors }));

    startTransition(async () => {
      const result = await deleteBudgetCategory(category);
      if ("error" in result) {
        toast.error(result.error);
      }
    });
  };

  const handleAddSuggested = (anchor: SuggestedAnchor) => {
    const category = anchor.category || anchor.merchantName;
    handleAnchorUpdate(category, anchor.avgAmountKobo);
  };

  const handleVariableUpdate = (category: string, amountKobo: number) => {
    const existing = state.variables.find((v) => v.category === category);
    const newVariables = existing
      ? state.variables.map((v) =>
          v.category === category ? { ...v, amountKobo } : v
        )
      : [
          ...state.variables,
          {
            id: crypto.randomUUID(),
            category,
            amountKobo,
            icon: null,
            color: null,
          },
        ];

    setState(recalculateTotals({ variables: newVariables }));

    startTransition(async () => {
      const result = await upsertBudgetCategory(
        category,
        amountKobo,
        "VARIABLE"
      );
      if ("error" in result) {
        toast.error(result.error);
      }
    });
  };

  const handleVariableDelete = (category: string) => {
    const newVariables = state.variables.filter((v) => v.category !== category);
    setState(recalculateTotals({ variables: newVariables }));

    startTransition(async () => {
      const result = await deleteBudgetCategory(category);
      if ("error" in result) {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 pb-24">
        <h1 className="font-sans text-2xl font-semibold text-primary">Plan</h1>

        {/* Income Target */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <label className="text-sm text-gray-500 mb-2 block">
            Monthly Income Target
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">
              ₦
            </span>
            <input
              type="number"
              value={incomeInput}
              onChange={(e) => setIncomeInput(e.target.value)}
              onBlur={handleIncomeBlur}
              placeholder="0"
              className="w-full h-14 pl-10 pr-4 text-3xl font-mono font-medium text-gray-800 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-tertiary/50 outline-none"
            />
          </div>
        </div>

        {/* Allocation Progress */}
        <AllocationBar
          incomeKobo={state.incomeKobo}
          allocatedKobo={state.totalAllocatedKobo}
        />

        {/* Fixed Expenses (Anchors) */}
        <AnchorSection
          anchors={state.anchors}
          suggestedAnchors={suggestedAnchors}
          onUpdate={handleAnchorUpdate}
          onDelete={handleAnchorDelete}
          onAddSuggested={handleAddSuggested}
        />

        {/* Variable Spending */}
        <VariableSection
          variables={state.variables}
          leftToAllocate={state.surplusKobo}
          onUpdate={handleVariableUpdate}
          onDelete={handleVariableDelete}
        />

        {isPending && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg">
            Saving...
          </div>
        )}
      </main>
    </div>
  );
}
