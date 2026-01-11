import type { AIProvider } from "./types";
import { OllamaProvider } from "./providers/ollama-provider";

export type AIProviderType = "ollama" | "openai" | "gemini";

export class AIFactory {
  private static instance: AIProvider | null = null;

  static getProvider(): AIProvider {
    if (this.instance) return this.instance;

    const providerType = (process.env.AI_PROVIDER ||
      "ollama") as AIProviderType;

    switch (providerType) {
      case "ollama":
        this.instance = new OllamaProvider();
        break;

      case "openai":
        // Future: OpenAI provider implementation
        throw new Error("OpenAI provider not yet implemented");

      case "gemini":
        // Future: Gemini provider implementation
        throw new Error("Gemini provider not yet implemented");

      default:
        console.warn(
          `Unknown AI provider: ${providerType}, falling back to Ollama`
        );
        this.instance = new OllamaProvider();
    }

    return this.instance;
  }

  static resetProvider(): void {
    this.instance = null;
  }
}
