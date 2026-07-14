import { runAgent, AgentResult } from "./Agent";
import * as Prompts from "../prompts";

export async function orchestrateVenture(idea: string, branding: string) {
  const userPrompt = `Startup Idea: "${idea}"\nBranding Style: "${branding}"`;

  // Parallel Execution
  const agentPromises = [
    runAgent("venture", Prompts.VENTURE_PROMPT, userPrompt),
    runAgent("customers", Prompts.CUSTOMER_PROMPT, userPrompt),
    runAgent("market", Prompts.MARKET_PROMPT, userPrompt),
    runAgent("competition", Prompts.COMPETITOR_PROMPT, userPrompt),
    runAgent("product", Prompts.PRODUCT_PROMPT, userPrompt),
    runAgent("technology", Prompts.TECHNOLOGY_PROMPT, userPrompt),
    runAgent("financials", Prompts.FINANCE_PROMPT, userPrompt),
    runAgent("marketing", Prompts.MARKETING_PROMPT, userPrompt),
    runAgent("risk", Prompts.RISK_PROMPT, userPrompt),
    runAgent("funding", Prompts.FUNDING_PROMPT, userPrompt),
  ];

  const results = await Promise.all(agentPromises);

  // Synthesis Engine
  const synthesisInput = results.map(r => ({
    agent: r.agent,
    data: r.output
  }));

  const synthesisResult = await runAgent(
    "synthesis",
    Prompts.SYNTHESIS_PROMPT,
    JSON.stringify(synthesisInput)
  );

  // Calculate overall confidence and metrics
  const totalTokens = results.reduce((sum, r) => sum + r.tokens, 0) + synthesisResult.tokens;
  const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;

  return {
    ...synthesisResult.output,
    agent_logs: results.map(r => ({
      agent: r.agent,
      status: "completed",
      duration: `${(r.duration / 1000).toFixed(1)}s`,
      provider: r.provider,
      tokens: r.tokens,
      confidence: r.confidence
    })),
    metadata: {
      total_tokens: totalTokens,
      avg_confidence: avgConfidence,
      generation_time: results.reduce((max, r) => Math.max(max, r.duration), 0) + synthesisResult.duration
    }
  };
}
