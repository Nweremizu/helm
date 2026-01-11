export interface TransactionInput {
  id: string;
  narration: string;
  amount_naira: string;
  type: "DEBIT" | "CREDIT";
  date: string;
}

export interface CategorizationResult {
  id: string;
  cleanName: string;
  category: string;
  icon: string;
  ruleKeyword: string | null;
  confidence: number;
}

export interface AIProvider {
  categorizeBatch(
    transactions: TransactionInput[]
  ): Promise<CategorizationResult[]>;
}

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

export const VALID_CATEGORIES = Object.keys(CATEGORY_ICONS);
