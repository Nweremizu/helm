export interface SpendingCategory {
  category: string;
  amountKobo: number;
  amountNaira: number;
  percentage: number;
  icon: string | null;
  transactionCount: number;
}

export interface DailySpendingPoint {
  date: string;
  incomeKobo: number;
  expenseKobo: number;
  netKobo: number;
}

export interface NetWorthPoint {
  date: string;
  balanceKobo: number;
  balanceNaira: number;
}

export interface RecurringTransaction {
  id: string;
  name: string;
  amountKobo: number;
  category: string;
  frequency: "weekly" | "monthly" | "yearly";
  nextDueDate: Date;
  confidence: number;
}

export interface SalaryInfo {
  detected: boolean;
  amountKobo: number | null;
  sourceKeyword: string | null;
  lastReceivedDate: Date | null;
  expectedDay: number | null;
  daysUntilNext: number | null;
}

export interface PulseMetrics {
  currentBalanceKobo: number;
  safeToSpendKobo: number;
  upcomingBillsKobo: number;
  avgDailySpendKobo: number;
  daysUntilSalary: number | null;
  burnRate: number;
  safetyStatus: "safe" | "caution" | "danger";
}

export interface DashboardMetrics {
  pulse: PulseMetrics;
  salary: SalaryInfo;
  spendingBreakdown: SpendingCategory[];
  netWorthTrend: NetWorthPoint[];
  dailyVelocity: DailySpendingPoint[];
  recurringBills: RecurringTransaction[];
}

export const KOBO_DIVISOR = 100;
export const SALARY_THRESHOLD_KOBO = 5_000_000; // ₦50,000

export const CATEGORY_ICONS: Record<string, string> = {
  "Food & Dining": "utensils",
  Transport: "car",
  Shopping: "shopping-bag",
  Entertainment: "tv",
  Utilities: "zap",
  Health: "heart-pulse",
  Education: "graduation-cap",
  Income: "wallet",
  Transfer: "arrow-right-left",
  Subscription: "repeat",
  Groceries: "shopping-cart",
  Travel: "plane",
  Insurance: "shield",
  Investment: "trending-up",
  Rent: "home",
  Fees: "receipt",
  ATM: "banknote",
  Other: "circle-help",
};

export function koboToNaira(kobo: number): number {
  return kobo / KOBO_DIVISOR;
}

export function nairaToKobo(naira: number): number {
  return Math.round(naira * KOBO_DIVISOR);
}

export function formatNaira(kobo: number): string {
  const naira = koboToNaira(kobo);
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(naira);
}
