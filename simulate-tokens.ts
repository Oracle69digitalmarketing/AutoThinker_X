import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

const API_KEY = process.env.GEMINI_API_KEY;
console.log(`Using API Key starting with: ${API_KEY?.substring(0, 10)}...`);
if (!API_KEY || API_KEY === "REPLACE_ME_IN_VERCEL") {
  console.error("Valid GEMINI_API_KEY is not set in environment.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const modelName = "gemini-2.0-flash-lite";

async function runTest(idea: string, branding: string = "tech-bold") {
  console.log(`\n--- Starting Simulation for Idea: "${idea}" ---`);
  
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  try {
    // 1. Venture Architect
    console.log("1. Venture Architect Thinking...");
    const architectResponse = await ai.models.generateContent({
      model: modelName,
      contents: `You are an elite Venture Architect. Branding style: ${branding}. Expand this idea: "${idea}"
      Provide a structured analysis including:
      - Core Problem & Solution
      - Target Audience: Detailed demographics and psychographics
      - 3 Distinct Customer Profiles: Include Name, specific Pain Points, and Motivations for each
      - Value Proposition Canvas: Define specific User Jobs, Pains, and Gains
      - Strategic SWOT Analysis: Break down Strengths, Weaknesses, Opportunities, and Threats clearly.`
    });
    const conceptData = architectResponse.text || '';
    const architectUsage = architectResponse.usageMetadata;
    totalInputTokens += architectUsage?.promptTokenCount || 0;
    totalOutputTokens += architectUsage?.candidatesTokenCount || 0;
    console.log(`   Tokens: ${architectUsage?.promptTokenCount} in, ${architectUsage?.candidatesTokenCount} out`);

    // 1.5 Market Intelligence
    console.log("2. Market Intelligence Thinking...");
    const marketResponse = await ai.models.generateContent({
      model: modelName,
      contents: `You are a Market Intelligence Analyst. Branding style: ${branding}. Based on this venture concept: "${conceptData}"
      Identify:
      - 3-4 key competitors in this space
      - For each: Their name, their unfair advantage, and the critical GAP they are missing that this startup fills.`
    });
    const marketData = marketResponse.text || '';
    const marketUsage = marketResponse.usageMetadata;
    totalInputTokens += marketUsage?.promptTokenCount || 0;
    totalOutputTokens += marketUsage?.candidatesTokenCount || 0;
    console.log(`   Tokens: ${marketUsage?.promptTokenCount} in, ${marketUsage?.candidatesTokenCount} out`);

    // 2. Growth Marketing
    console.log("3. Growth Marketing Thinking...");
    const growthResponse = await ai.models.generateContent({
      model: modelName,
      contents: `You are a Growth Marketing Director. Branding style: ${branding}. Based on this venture concept: "${conceptData}"
      Develop:
      - Full Marketing Funnel Strategy
      - Email Sequence (3 emails: Welcome, Value, Offer)
      - Social Post Series (3 posts)
      - Lead Magnet & Tripwire Offer
      - Ad Copy for Facebook & Google`
    });
    const marketingData = growthResponse.text || '';
    const growthUsage = growthResponse.usageMetadata;
    totalInputTokens += growthUsage?.promptTokenCount || 0;
    totalOutputTokens += growthUsage?.candidatesTokenCount || 0;
    console.log(`   Tokens: ${growthUsage?.promptTokenCount} in, ${growthUsage?.candidatesTokenCount} out`);

    // 3. Document Specialist
    console.log("4. Document Specialist Thinking...");
    const docResponse = await ai.models.generateContent({
      model: modelName,
      contents: `You are a professional copywriter and business analyst. Branding style: ${branding}. Based on the concept: "${conceptData}"
      Create:
      - High-converting Landing Page Copy (Hero, Subline, CTA)
      - Investor One-Pager (Executive Summary)
      - 5-step Execution Plan
      - 3-phase Roadmap`
    });
    const docData = docResponse.text || '';
    const docUsage = docResponse.usageMetadata;
    totalInputTokens += docUsage?.promptTokenCount || 0;
    totalOutputTokens += docUsage?.candidatesTokenCount || 0;
    console.log(`   Tokens: ${docUsage?.promptTokenCount} in, ${docUsage?.candidatesTokenCount} out`);

    // 4. Synthesis Engine
    console.log("5. Synthesis Engine Formatting...");
    const builderResponse = await ai.models.generateContent({
      model: modelName,
      contents: `You are a precision data engineer. Synthesize the provided information into a single, valid JSON object.
      Branding: ${branding}.
      Output ONLY the JSON.

      Concept: ${conceptData}
      Market: ${marketData}
      Marketing: ${marketingData}
      Assets: ${docData}

      JSON Schema:
      {
        "name": "Startup Name",
        "tagline": "Punchy tagline",
        "pitch": "One sentence elevator pitch",
        "branding": "${branding}",
        "value_proposition": { "pains": "...", "gains": "...", "jobs": "..." },
        "customer_profiles": [
          { "name": "...", "pain_points": ["..."], "motivations": ["..."], "demographics": "..." }
        ],
        "swot": { "strengths": "...", "weaknesses": "...", "opportunities": "...", "threats": "..." },
        "competitors": [
          { "name": "...", "advantage": "...", "gap": "..." }
        ],
        "marketing": {
          "funnel_strategy": "...",
          "ads_copy": { "facebook": "...", "google": "..." },
          "lead_magnet": { "title": "...", "description": "...", "tripwire_offer": "..." },
          "email_sequence": [ { "subject": "...", "body": "..." } ],
          "social_posts": ["Post 1", "Post 2", "Post 3"]
        },
        "roadmap": [ { "phase": 1, "title": "...", "description": "..." } ],
        "execution_plan": [ { "step": 1, "title": "...", "description": "..." } ],
        "one_pager": "...",
        "landing_copy": { "hero_headline": "...", "hero_subheadline": "...", "cta_text": "..." }
      }`,
      config: { responseMimeType: "application/json" }
    });
    const builderUsage = builderResponse.usageMetadata;
    totalInputTokens += builderUsage?.promptTokenCount || 0;
    totalOutputTokens += builderUsage?.candidatesTokenCount || 0;
    console.log(`   Tokens: ${builderUsage?.promptTokenCount} in, ${builderUsage?.candidatesTokenCount} out`);

    console.log("\n--- Final Results ---");
    console.log(`Total Input Tokens: ${totalInputTokens}`);
    console.log(`Total Output Tokens: ${totalOutputTokens}`);
    
    // Cost calculation (Gemini 2.0 Flash Lite)
    // Input: $0.075 / 1M
    // Output: $0.30 / 1M
    const inputCost = (totalInputTokens / 1000000) * 0.075;
    const outputCost = (totalOutputTokens / 1000000) * 0.30;
    const totalCost = inputCost + outputCost;

    console.log(`Estimated Cost (USD): $${totalCost.toFixed(4)}`);
    console.log(`Unit Cost per Blueprint: ~$${totalCost.toFixed(3)}`);
    console.log("----------------------\n");

  } catch (error) {
    console.error("Simulation failed:", error);
  }
}

const testIdea = "A high-performance energy drink using fermented botanicals for mental clarity without the crash.";
runTest(testIdea);
