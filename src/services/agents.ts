import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama-3.3-70b-versatile";

async function getGroqCompletion(systemPrompt: string, userPrompt: string) {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model: MODEL,
    temperature: 0.7,
    max_tokens: 4096,
  });
  return completion.choices[0]?.message?.content || "";
}

export async function generateStartupBlueprint(idea: string, branding: string) {
  // 1. Venture Architect Agent
  const architectPrompt = `You are an elite Venture Architect. Branding style: ${branding}. Expand this idea: "${idea}"
  Provide a structured analysis including:
  - Core Problem & Solution
  - Target Audience: Detailed demographics and psychographics
  - 3 Distinct Customer Profiles: Include Name, specific Pain Points, and Motivations for each
  - Value Proposition Canvas: Define specific User Jobs, Pains, and Gains
  - Strategic SWOT Analysis: Break down Strengths, Weaknesses, Opportunities, and Threats clearly.`;
  
  const conceptData = await getGroqCompletion("You are a startup architect.", architectPrompt);

  // 2. Market Intelligence Agent
  const marketPrompt = `You are a Market Intelligence Analyst. Branding style: ${branding}. Based on this venture concept: "${conceptData}"
  Identify:
  - 3-4 key competitors in this space
  - For each: Their name, their unfair advantage, and the critical GAP they are missing that this startup fills.`;
  
  const marketData = await getGroqCompletion("You are a market analyst.", marketPrompt);

  // 3. Growth & Marketing Agent
  const growthPrompt = `You are a Growth Marketing Director. Branding style: ${branding}. Based on this venture concept: "${conceptData}"
  Develop:
  - Full Marketing Funnel Strategy
  - Email Sequence (3 emails: Welcome, Value, Offer)
  - Social Post Series (3 posts)
  - Lead Magnet & Tripwire Offer
  - Ad Copy for Facebook & Google`;
  
  const marketingData = await getGroqCompletion("You are a growth marketing expert.", growthPrompt);

  // 4. Document Specialist Agent
  const docPrompt = `You are a professional copywriter and business analyst. Branding style: ${branding}. Based on the concept: "${conceptData}"
  Create:
  - High-converting Landing Page Copy (Hero, Subline, CTA)
  - Investor One-Pager (Executive Summary)
  - 5-step Execution Plan
  - 3-phase Roadmap`;
  
  const docData = await getGroqCompletion("You are an asset specialist.", docPrompt);

  // 5. Synthesis & Formatting Agent
  const synthesisPrompt = `You are a precision data engineer. Synthesize the provided information into a single, valid JSON object.
  
  Information to synthesize:
  - Branding Style: ${branding}
  - Concept Analysis: ${conceptData}
  - Market Intelligence: ${marketData}
  - Marketing Collateral: ${marketingData}
  - Launch Assets: ${docData}

  JSON Schema Requirements:
  {
    "name": "Startup Name",
    "tagline": "A punchy, memorable tagline",
    "pitch": "A compelling one-sentence elevator pitch",
    "branding": "${branding}", 
    "value_proposition": { "pains": "string", "gains": "string", "jobs": "string" },
    "customer_profiles": [{ "name": "string", "pain_points": ["string"], "motivations": ["string"], "demographics": "string" }],
    "swot": { "strengths": "string", "weaknesses": "string", "opportunities": "string", "threats": "string" },
    "competitors": [{ "name": "string", "advantage": "string", "gap": "string" }],
    "marketing": {
      "funnel_strategy": "string",
      "ads_copy": { "facebook": "string", "google": "string" },
      "lead_magnet": { "title": "string", "description": "string", "tripwire_offer": "string" },
      "email_sequence": [ { "subject": "string", "body": "string" } ],
      "social_posts": ["string"]
    },
    "roadmap": [ { "phase": 1, "title": "string", "description": "string" } ],
    "execution_plan": [ { "step": 1, "title": "string", "description": "string" } ],
    "one_pager": "Complete executive summary / one-pager text",
    "landing_copy": { "hero_headline": "string", "hero_subheadline": "string", "cta_text": "string" }
  }

  Rules:
  1. Output ONLY valid JSON.
  2. All arrays must contain at least one valid object.
  3. The 'branding' value must be exactly "${branding}".`;

  const finalJson = await getGroqCompletion("You are a JSON synthesis engine.", synthesisPrompt);
  
  // Extract JSON
  const jsonMatch = finalJson.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : finalJson);
}

export async function generatePitchDeck(blueprint: any) {
  const prompt = `You are a startup fundraising expert. Based on the business blueprint below, generate a professional 7-slide pitch deck. Output ONLY a JSON array.
  
  Business Name: ${blueprint.name}
  Pitch: ${blueprint.pitch}

  JSON format:
  [
    { "title": "Slide Title", "content": "Slide content...", "visual_cue": "Visual description..." }
  ]`;

  const response = await getGroqCompletion("You are a pitch deck expert.", prompt);
  const jsonMatch = response.match(/\[[\s\S]*\]/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : response);
}

export async function findFunding(blueprint: any) {
  const prompt = `You are a venture capital researcher. Based on the business idea below, find 4-5 relevant funding opportunities. Output ONLY a JSON array.
  
  Idea: ${blueprint.pitch}

  JSON format:
  [
    { "name": "Name", "type": "hackathon|cohort|grant|vc", "description": "Short description", "link": "https://example.com", "relevance": "Why this fits" }
  ]`;

  const response = await getGroqCompletion("You are a funding researcher.", prompt);
  const jsonMatch = response.match(/\[[\s\S]*\]/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : response);
}
