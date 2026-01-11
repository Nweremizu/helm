/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ollama } from "ollama";
import { prisma } from "@/prisma/db";
import { VALID_CATEGORIES } from "./types";
import { formatNaira, koboToNaira } from "@/lib/analytics/types";

interface QueryFilter {
  category?: string | null;
  merchant?: string | null;
  dateRange?: {
    start: string;
    end: string;
  };
  intent: "calculate_total" | "list_transactions" | "unknown";
  confidence: number;
}

interface ClarificationResponse {
  type: "clarification";
  message: string;
  suggestions: string[];
}

export interface ChatResponse {
  type: "answer" | "clarification" | "error";
  message: string;
  suggestions?: string[];
}

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

function getDateRange(query: string): { start: Date; end: Date } {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Check for "last month"
  if (
    query.toLowerCase().includes("last month") ||
    query.toLowerCase().includes("previous month")
  ) {
    const lastMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfLastMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);
    return { start: lastMonth, end: endOfLastMonth };
  }

  // Check for month names
  const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  for (let i = 0; i < monthNames.length; i++) {
    if (query.toLowerCase().includes(monthNames[i])) {
      const monthDate = new Date(currentYear, i, 1);
      const endDate = new Date(currentYear, i + 1, 0, 23, 59, 59);
      return { start: monthDate, end: endDate };
    }
  }

  // Check for "last N days"
  const daysMatch = query.match(/last\s+(\d+)\s+days?/i);
  if (daysMatch) {
    const days = parseInt(daysMatch[1], 10);
    const start = new Date(now);
    start.setDate(start.getDate() - days);
    return { start, end: now };
  }

  // Default: this month
  const start = new Date(currentYear, currentMonth, 1);
  return { start, end: now };
}

async function extractQueryFilter(query: string): Promise<QueryFilter> {
  const client = new Ollama({
    host: process.env.OLLAMA_HOST || "http://localhost:11434",
  });
  const model = process.env.OLLAMA_MODEL || "llama3.2:3b";

  const systemPrompt = `You are a financial query parser. Extract the user's intent from their question about transactions.

Available categories: ${VALID_CATEGORIES.join(", ")}

RESPOND WITH STRICT JSON ONLY. No markdown, no explanations.

Output format (required fields):
{
  "intent": "calculate_total" | "list_transactions" | "unknown",
  "category": "Food" | null,
  "merchant": "Uber" | null,
  "confidence": 0.0 to 1.0
}

Examples:
- "How much did I spend on food last month?" → {"intent":"calculate_total","category":"Food","merchant":null,"confidence":0.95}
- "Did I pay my Starlink bill?" → {"intent":"list_transactions","category":null,"merchant":"Starlink","confidence":0.9}
- "Random question" → {"intent":"unknown","category":null,"merchant":null,"confidence":0.0}`;

  try {
    const response = await client.generate({
      model,
      prompt: query,
      system: systemPrompt,
      stream: false,
      format: "json",
    });

    const sanitized = sanitizeJson(response.response);
    const parsed = JSON.parse(sanitized);

    const dateRange = getDateRange(query);

    return {
      category: parsed.category || null,
      merchant: parsed.merchant || null,
      intent: parsed.intent || "unknown",
      confidence: parsed.confidence || 0,
      dateRange: {
        start: dateRange.start.toISOString().split("T")[0],
        end: dateRange.end.toISOString().split("T")[0],
      },
    };
  } catch (error) {
    console.error("[SonarChat] Failed to extract filter:", error);

    const keywords = query.toLowerCase().split(/\s+/);
    const matchedCategory = VALID_CATEGORIES.find((cat) =>
      keywords.some((kw) => cat.toLowerCase().includes(kw))
    );

    return {
      category: matchedCategory || null,
      merchant: null,
      intent:
        keywords.includes("how") || keywords.includes("much")
          ? "calculate_total"
          : "list_transactions",
      confidence: 0.3,
      dateRange: {
        start: getDateRange(query).start.toISOString().split("T")[0],
        end: getDateRange(query).end.toISOString().split("T")[0],
      },
    };
  }
}

export async function processUserQuery(
  userId: string,
  query: string
): Promise<ChatResponse> {
  const filter = await extractQueryFilter(query);

  if (filter.confidence < 0.75) {
    const suggestions: string[] = [];
    if (filter.category) {
      suggestions.push(`Show all ${filter.category} transactions`);
    }
    if (filter.merchant) {
      suggestions.push(`Show transactions for ${filter.merchant}`);
    }
    suggestions.push("Rephrase your question");

    return {
      type: "clarification",
      message: `I'm not sure I understood. Did you mean one of these?`,
      suggestions,
    };
  }

  if (filter.intent === "unknown") {
    return {
      type: "error",
      message:
        "I can help with questions about your spending, like 'How much on Food?' or 'Did I pay Netflix?'",
    };
  }

  try {
    const dateStart = new Date(filter.dateRange!.start);
    const dateEnd = new Date(filter.dateRange!.end);
    dateEnd.setHours(23, 59, 59, 999);

    const where: any = {
      userId,
      type: "DEBIT",
      date: {
        gte: dateStart,
        lte: dateEnd,
      },
    };

    if (filter.category) {
      where.cleanCategory = filter.category;
    }

    if (filter.merchant) {
      where.cleanName = {
        contains: filter.merchant,
        mode: "insensitive",
      };
    }

    if (filter.intent === "calculate_total") {
      const result = await prisma.transaction.aggregate({
        where,
        _sum: { amount: true },
        _count: { id: true },
      });

      const totalKobo = result._sum.amount || 0;
      const count = result._count.id || 0;

      if (count === 0) {
        return {
          type: "answer",
          message: `No transactions found for ${
            filter.category || filter.merchant || "your query"
          } during this period.`,
        };
      }

      const categoryText = filter.category ? `on ${filter.category}` : "";
      const merchantText = filter.merchant ? `on ${filter.merchant}` : "";
      const descriptor = categoryText || merchantText || "matching that query";

      return {
        type: "answer",
        message: `You spent ${formatNaira(
          totalKobo
        )} ${descriptor} across ${count} transaction${count !== 1 ? "s" : ""}.`,
      };
    } else {
      const transactions = await prisma.transaction.findMany({
        where,
        orderBy: { date: "desc" },
        take: 5,
        select: {
          amount: true,
          cleanName: true,
          cleanCategory: true,
          date: true,
        },
      });

      if (transactions.length === 0) {
        return {
          type: "answer",
          message: `No transactions found for ${
            filter.category || filter.merchant || "your query"
          } during this period.`,
        };
      }

      const txList = transactions
        .map(
          (tx) =>
            `• ${tx.cleanName} (${tx.cleanCategory}): ${formatNaira(
              tx.amount
            )} on ${new Date(tx.date).toLocaleDateString("en-NG")}`
        )
        .join("\n");

      const descriptor = filter.category || filter.merchant || "your query";
      return {
        type: "answer",
        message: `Here are your recent transactions for ${descriptor}:\n\n${txList}`,
      };
    }
  } catch (error) {
    console.error("[SonarChat] Query execution failed:", error);
    return {
      type: "error",
      message:
        "I ran into a problem looking up that information. Please try again.",
    };
  }
}
