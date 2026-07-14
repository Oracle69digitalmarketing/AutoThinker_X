import axios from "axios";
import { AIProvider, AIRequest, AIResponse } from "./AIProvider";

export class DeepSeekProvider implements AIProvider {
  name = "deepseek";
  private apiKey: string;
  private model: string;
  private baseUrl = "https://api.deepseek.com";

  constructor(apiKey: string, model: string = "deepseek-chat") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateCompletion(request: AIRequest): Promise<AIResponse> {
    const start = Date.now();
    try {
      const response = await axios.post(`${this.baseUrl}/chat/completions`, {
        model: this.model,
        messages: [
          { role: "system", content: request.systemPrompt },
          { role: "user", content: request.userPrompt },
        ],
        temperature: request.temperature ?? 0.2,
        response_format: request.jsonMode ? { type: "json_object" } : undefined
      }, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        timeout: 90000 // 90s for deepseek
      });

      const data = response.data;
      return {
        content: data.choices[0].message.content,
        provider: this.name,
        model: this.model,
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
        latency: Date.now() - start,
      };
    } catch (error: any) {
      console.error("DeepSeek Error:", error.message);
      throw error;
    }
  }
}
