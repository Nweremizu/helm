import { Ollama } from "ollama";
import type {
  AIProvider,
  TransactionInput,
  CategorizationResult,
} from "../types";

const SYSTEM_PROMPT = `You are a financial transaction categorizer for a Nigerian fintech app called Helm. Analyze bank transaction narrations and return structured categorization data.

RULES:
1. Extract a clean, human-readable merchant/description name from the narration
2. Assign ONE category from this EXACT list: Food & Dining, Transport, Shopping, Entertainment, Utilities, Health, Education, Income, Transfer, Subscription, Groceries, Travel, Insurance, Investment, Rent, Fees, ATM, Other
3. Assign an icon name (lowercase, kebab-case) that matches the category
4. If you can identify a clear merchant keyword (e.g., "UBER", "NETFLIX", "BOLT", "SHOPRITE"), return it in UPPERCASE for future rule-based matching. Only return keywords for well-known merchants.
5. Provide a confidence score between 0 and 1

ICON MAPPING:
- Food & Dining: "utensils"
- Transport: "car"
- Shopping: "shopping-bag"
- Entertainment: "tv"
- Utilities: "zap"
- Health: "heart-pulse"
- Education: "graduation-cap"
- Income: "wallet"
- Transfer: "arrow-right-left"
- Subscription: "repeat"
- Groceries: "shopping-cart"
- Travel: "plane"
- ATM: "banknote"
- Fees: "receipt"
- Other: "circle-help"

RESPOND WITH STRICT JSON ONLY. No markdown code blocks, no explanations, no backticks.

Output format (JSON array):
[{"id":"tx-id","cleanName":"Uber Ride","category":"Transport","icon":"car","ruleKeyword":"UBER","confidence":0.95}]`;

function sanitizeJson(response: string): string {
  let cleaned = response.trim();

  const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    cleaned = jsonMatch[1].trim();
  }

  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }

  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }

  return cleaned.trim();
}

export class OllamaProvider implements AIProvider {
  private client: Ollama;
  private model: string;

  constructor() {
    this.client = new Ollama({
      host: process.env.OLLAMA_HOST || "http://localhost:11434",
    });
    this.model = process.env.OLLAMA_MODEL || "llama3.2:3b";
  }

  async categorizeBatch(
    transactions: TransactionInput[]
  ): Promise<CategorizationResult[]> {
    if (transactions.length === 0) return [];

    const userPrompt = `Categorize these ${
      transactions.length
    } Nigerian bank transactions. Amounts are in Naira (₦).

${JSON.stringify(
  transactions.map((tx) => ({
    id: tx.id,
    narration: tx.narration,
    amount_naira: tx.amount_naira,
    type: tx.type,
  })),
  null,
  2
)}

Return a JSON array with categorization for each transaction. Remember: STRICT JSON ONLY, no markdown.`;

    try {
      console.log(
        `[OllamaProvider] Sending ${transactions.length} transactions to ${this.model}`
      );

      const response = await this.client.chat({
        model: this.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        format: "json",
        options: {
          temperature: 0.1,
          num_predict: 4096,
        },
      });

      const content = response.message.content;
      console.log("[OllamaProvider] Raw response:", content.substring(0, 200));

      const sanitized = sanitizeJson(content);
      const parsed = JSON.parse(sanitized);

      if (!Array.isArray(parsed)) {
        console.error("[OllamaProvider] Response is not an array:", parsed);
        return this.getFallbackResults(transactions);
      }

      return parsed.map((result: CategorizationResult, index: number) => ({
        id: result.id || transactions[index]?.id,
        cleanName: result.cleanName || "Unknown Transaction",
        category: this.validateCategory(result.category),
        icon: result.icon || "circle-help",
        ruleKeyword: result.ruleKeyword
          ? result.ruleKeyword.toUpperCase()
          : null,
        confidence: Math.min(1, Math.max(0, result.confidence || 0.5)),
      }));
    } catch (error) {
      console.error("[OllamaProvider] Categorization failed:", error);
      return this.getFallbackResults(transactions);
    }
  }

  private validateCategory(category: string): string {
    const validCategories = [
      "Food & Dining",
      "Transport",
      "Shopping",
      "Entertainment",
      "Utilities",
      "Health",
      "Education",
      "Income",
      "Transfer",
      "Subscription",
      "Groceries",
      "Travel",
      "Insurance",
      "Investment",
      "Rent",
      "Fees",
      "ATM",
      "Other",
    ];

    return validCategories.includes(category) ? category : "Other";
  }

  private getFallbackResults(
    transactions: TransactionInput[]
  ): CategorizationResult[] {
    return transactions.map((tx) => ({
      id: tx.id,
      cleanName: this.extractCleanName(tx.narration),
      category: "Other",
      icon: "circle-help",
      ruleKeyword: null,
      confidence: 0,
    }));
  }

  private extractCleanName(narration: string): string {
    return (
      narration
        .replace(/POS\s*(WDL|PURCHASE)?/gi, "")
        .replace(/NIP\s*(TRF)?/gi, "Transfer")
        .replace(/ATM\s*(WDL)?/gi, "ATM Withdrawal")
        .replace(/\d{10,}/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 50) || "Transaction"
    );
  }
}
