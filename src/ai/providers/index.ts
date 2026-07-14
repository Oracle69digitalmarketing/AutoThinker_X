import { AIProvider, AIRequest, AIResponse } from "./AIProvider";
import { GroqProvider } from "./GroqProvider";
import { DeepSeekProvider } from "./DeepSeekProvider";
import dotenv from "dotenv";

dotenv.config();

export class AIOrchestrator {
  private primary: AIProvider;
  private fallback: AIProvider | null = null;

  constructor() {
    const groqKey = process.env.GROQ_API_KEY || "";
    const deepseekKey = process.env.DEEPSEEK_API_KEY || "";

    this.primary = new GroqProvider(groqKey);
    if (deepseekKey) {
      this.fallback = new DeepSeekProvider(deepseekKey);
    }
  }

  async generateCompletion(request: AIRequest): Promise<AIResponse> {
    try {
      return await this.primary.generateCompletion(request);
    } catch (error) {
      if (this.fallback) {
        console.warn("Primary AI failed, using fallback...");
        return await this.fallback.generateCompletion(request);
      }
      throw error;
    }
  }
}

export const ai = new AIOrchestrator();
