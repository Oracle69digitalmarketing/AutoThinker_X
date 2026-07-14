import { ai } from "../providers";
import { AIResponse } from "../providers/AIProvider";
import { getCachedCompletion, setCachedCompletion, generateCacheKey } from "../utils/cache";

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
  const cacheKey = generateCacheKey(name, userPrompt);
  const cached = getCachedCompletion(cacheKey);
  
  if (cached) {
    console.log(`[Cache Hit] Agent: ${name}`);
    return {
      ...cached,
      duration: 0, 
      provider: "cache"
    };
  }

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
      
      const result = {
        agent: name,
        output: parsed.output,
        confidence: parsed.confidence || 0,
        duration: Date.now() - start,
        provider: response.provider,
        tokens: response.usage?.totalTokens || 0,
      };

      setCachedCompletion(cacheKey, result);
      return result;
    } catch (error) {
      console.error(`Agent ${name} failed (Retries left: ${retries}):`, error);
      retries--;
      if (retries < 0) {
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
