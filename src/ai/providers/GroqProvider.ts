import Groq from "groq-sdk";
import { AIProvider, AIRequest, AIResponse } from "./AIProvider";

export class GroqProvider implements AIProvider {
  name = "groq";
  private client: Groq;
  private model: string;

  constructor(apiKey: string, model: string = "llama-3.3-70b-versatile") {
    this.client = new Groq({ apiKey });
    this.model = model;
  }

  async generateCompletion(request: AIRequest): Promise<AIResponse> {
    const start = Date.now();
    try {
      const completion = await this.client.chat.completions.create({
        messages: [
          { role: "system", content: request.systemPrompt },
          { role: "user", content: request.userPrompt },
        ],
        model: this.model,
        temperature: request.temperature ?? 0.1,
        response_format: request.jsonMode ? { type: "json_object" } : undefined,
      });

      return {
        content: completion.choices[0]?.message?.content || "",
        provider: this.name,
        model: this.model,
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
        latency: Date.now() - start,
      };
    } catch (error: any) {
      console.error("Groq Error:", error.message);
      throw error;
    }
  }
}
