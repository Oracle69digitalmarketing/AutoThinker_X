import { getCompletion, Complexity } from "./router";
import { Blueprint } from "../types";

export async function generateStartupBlueprint(idea: string, branding: string, complexity: Complexity = 'medium'): Promise<Blueprint> {
  const systemPrompt = `You are a world-class AI Venture Operating System. Your goal is to transform a raw startup idea into a comprehensive, investor-ready venture blueprint.
  
  You must output ONLY valid JSON. No markdown, no code fences, no explanations.
  
  The output must follow this EXACT schema:
  {
    "name": "string",
    "tagline": "string",
    "pitch": "string",
    "branding": "${branding}",
    "overview": {
      "elevator_pitch": "string",
      "mission": "string",
      "vision": "string",
      "problem": "string",
      "solution": "string",
      "business_model": "string"
    },
    "venture": {
      "startup_name": "string",
      "tagline": "string",
      "elevator_pitch": "string",
      "mission": "string",
      "vision": "string",
      "problem": "string",
      "solution": "string",
      "business_model": "string"
    },
    "customers": {
      "icp": "string",
      "personas": [
        { "name": "string", "role": "string", "pain_points": ["string"], "motivations": ["string"] }
      ],
      "jobs_to_be_done": ["string"],
      "pain_points": ["string"],
      "customer_gains": ["string"]
    },
    "market": {
      "tam": "string",
      "sam": "string",
      "som": "string",
      "industry_trends": ["string"],
      "opportunities": ["string"]
    },
    "competitors": [
      { "name": "string", "strengths": "string", "weaknesses": "string", "market_gaps": "string" }
    ],
    "product": {
      "mvp": "string",
      "core_features": ["string"],
      "product_roadmap": ["string"]
    },
    "technology": {
      "frontend": "string",
      "backend": "string",
      "database": "string",
      "ai_stack": "string",
      "deployment": "string"
    },
    "marketing": {
      "positioning": "string",
      "gtm_strategy": "string",
      "funnel": "string",
      "landing_page_messaging": "string",
      "email_sequence": [
        { "subject": "string", "body": "string" }
      ],
      "social_content": ["string"]
    },
    "finance": {
      "revenue_streams": ["string"],
      "pricing": "string",
      "cost_structure": "string",
      "financial_assumptions": "string"
    },
    "funding": [
      { "name": "string", "type": "string", "description": "string", "relevance": "string" }
    ],
    "roadmap": [
      { "phase": "string", "tasks": ["string"] }
    ],
    "agent_logs": [
      { "agent": "Venture Architect", "status": "completed", "duration": "2.1s" },
      { "agent": "Customer Intelligence", "status": "completed", "duration": "1.8s" },
      { "agent": "Market Intelligence", "status": "completed", "duration": "1.5s" },
      { "agent": "Competitor Intelligence", "status": "completed", "duration": "1.2s" },
      { "agent": "Product Strategy", "status": "completed", "duration": "1.9s" },
      { "agent": "Technology Architecture", "status": "completed", "duration": "1.4s" },
      { "agent": "Marketing Strategy", "status": "completed", "duration": "2.3s" },
      { "agent": "Finance", "status": "completed", "duration": "1.1s" },
      { "agent": "Funding Intelligence", "status": "completed", "duration": "1.6s" },
      { "agent": "Execution Roadmap", "status": "completed", "duration": "0.9s" }
    ]
  }
  
  Internal logic for segments:
  - Venture Architect: Startup name, mission, problem/solution.
  - Customer Intelligence: ICP, 3 personas, JTBD.
  - Market Intelligence: TAM/SAM/SOM, trends.
  - Competitor Intelligence: 3-4 competitors with gaps.
  - Product Strategy: MVP definition and core features.
  - Technology Architecture: Full stack recommendations.
  - Marketing Strategy: GTM, Funnel, Landing Page messaging, Email sequence, Social content.
  - Finance: Revenue model, pricing, costs.
  - Funding: Grants, VCs, accelerators relevant to the niche.
  - Execution Roadmap: 3 phases of growth.
  
  Branding style to apply: ${branding}.
  Complexity level: ${complexity}.
  
  Simulation Rule: Generate the 'agent_logs' based on realistic simulated durations for each module.
  `;

  const userPrompt = `Generate a venture blueprint for this idea: "${idea}"`;
  
  const response = await getCompletion(systemPrompt, userPrompt, complexity);
  
  // Parse JSON
  let blueprint: Blueprint;
  try {
    blueprint = JSON.parse(response);
  } catch (e) {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    blueprint = JSON.parse(jsonMatch[0]);
  }
  
  // Ensure top-level fields are populated correctly from the nested venture object
  blueprint.name = blueprint.venture.startup_name || blueprint.name;
  blueprint.tagline = blueprint.venture.tagline || blueprint.tagline;
  blueprint.pitch = blueprint.venture.elevator_pitch || blueprint.pitch;
  blueprint.branding = branding as any;
  
  return blueprint;
}

// These are now handled in the single call above, but kept as stubs for backward compatibility if needed by the server
// However, the instructions say "One user generation = one model inference", so these shouldn't be called separately.
export async function generatePitchDeck(blueprint: any) {
  return blueprint.pitch_deck || [];
}

export async function findFunding(blueprint: any) {
  return blueprint.funding || [];
}
