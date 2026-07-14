import { ai } from "../providers";
import { AIResponse } from "../providers/AIProvider";

export interface AgentResult {
  agent: string;
  output: any;
  confidence: number;
  duration: number;
  provider: string;
  tokens: number;
}

export async function runAgent(
  name: string,
  systemPrompt: string,
  userPrompt: string,
  temperature: number = 0.1
): Promise<AgentResult> {
  const start = Date.now();
  let retries = 2;
  let response: AIResponse | null = null;

  while (retries >= 0) {
    try {
      response = await ai.generateCompletion({
        systemPrompt,
        userPrompt,
        temperature,
        jsonMode: true,
      });

      const parsed = JSON.parse(response.content);
      
      return {
        agent: name,
        output: parsed.output,
        confidence: parsed.confidence || 0,
        duration: Date.now() - start,
        provider: response.provider,
        tokens: response.usage?.totalTokens || 0,
      };
    } catch (error) {
      console.error(`Agent ${name} failed (Retries left: ${retries}):`, error);
      retries--;
      if (retries < 0) {
        // Final attempt: JSON Repair or return error structure
        return {
          agent: name,
          output: { error: "Failed to generate valid JSON" },
          confidence: 0,
          duration: Date.now() - start,
          provider: response?.provider || "none",
          tokens: response?.usage?.totalTokens || 0,
        };
      }
    }
  }

  throw new Error(`Agent ${name} failed critical execution`);
}
