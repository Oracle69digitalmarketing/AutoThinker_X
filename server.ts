import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { orchestrateVenture } from "./src/ai/agents/orchestrator";
import { generatePitchDeck } from "./src/ai/agents/pitchDeck";

dotenv.config();

// Compatibility Layer: Map VOS v3 schema back to V1 structure
function mapV3ToV1(v3: any): any {
  return {
    name: v3.venture?.name || "Unnamed Venture",
    tagline: v3.venture?.tagline || "",
    pitch: v3.venture?.elevator_pitch || "",
    overview: {
      elevator_pitch: v3.venture?.elevator_pitch || "",
      mission: v3.venture?.mission || "",
      vision: v3.venture?.vision || "",
      problem: v3.venture?.problem || "",
      solution: v3.venture?.solution || "",
      business_model: v3.business_model?.summary || ""
    },
    venture: {
      startup_name: v3.venture?.name || "",
      tagline: v3.venture?.tagline || "",
      elevator_pitch: v3.venture?.elevator_pitch || "",
      mission: v3.venture?.mission || "",
      vision: v3.venture?.vision || "",
      problem: v3.venture?.problem || "",
      solution: v3.venture?.solution || "",
      business_model: v3.business_model?.summary || ""
    },
    customers: {
      icp: v3.customers?.icp || "",
      personas: (v3.customers?.personas || []).map((p: any) => ({
        name: p.name || "",
        role: p.role || "",
        pain_points: p.pain_points || [],
        motivations: p.motivations || []
      })),
      jobs_to_be_done: v3.customers?.jtbd || [],
      pain_points: (v3.customers?.personas || []).flatMap((p: any) => p.pain_points || []),
      customer_gains: []
    },
    market: {
      tam: v3.market?.tam?.size || "",
      sam: v3.market?.sam?.size || "",
      som: v3.market?.som?.size || "",
      industry_trends: v3.market?.trends || [],
      opportunities: v3.market?.opportunities || []
    },
    competitors: (v3.competition?.matrix || []).map((c: any) => ({
      name: c.name || "",
      strengths: c.strength || "",
      weaknesses: c.weakness || "",
      market_gaps: c.differentiator || ""
    })),
    product: {
      mvp: v3.product?.unique_selling_point || "",
      core_features: v3.product?.mvp_features || [],
      product_roadmap: v3.product?.roadmap || []
    },
    technology: {
      frontend: v3.technology?.stack?.frontend || "",
      backend: v3.technology?.stack?.backend || "",
      database: v3.technology?.stack?.database || "",
      ai_stack: v3.technology?.stack?.ai || "",
      deployment: v3.technology?.stack?.infrastructure || ""
    },
    marketing: {
      positioning: v3.marketing?.gtm_strategy || "",
      gtm_strategy: v3.marketing?.gtm_strategy || "",
      funnel: v3.marketing?.funnel?.awareness || "",
      landing_page_messaging: v3.marketing?.ad_copy?.headline || "",
      email_sequence: [],
      social_content: []
    },
    finance: {
      revenue_streams: v3.business_model?.revenue_streams || [],
      pricing: v3.business_model?.pricing_strategy || "",
      cost_structure: v3.financials?.burn_rate_estimate || "",
      financial_assumptions: ""
    },
    funding: (v3.funding?.sources || []).map((s: any) => ({
      name: s.name || "",
      type: s.type || "",
      description: s.match_reason || "",
      relevance: s.investment_range || ""
    })),
    roadmap: [
      {
        phase: "Growth",
        tasks: v3.execution?.roadmap || []
      }
    ],
    agent_logs: v3.agent_logs || []
  };
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);
  const isProd = process.env.NODE_ENV === "production";

  app.use(helmet({
    contentSecurityPolicy: false,
  }));
  app.use(compression());
  app.use(morgan("dev"));
  app.use(cors());
  app.use(express.json());

  // AI Orchestration Endpoints
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { idea, branding } = req.body;
      if (!idea) return res.status(400).json({ error: "Idea is required" });
      
      const v3Blueprint = await orchestrateVenture(idea, branding || 'tech-bold');
      const v1Blueprint = mapV3ToV1(v3Blueprint);
      
      res.json(v1Blueprint);
    } catch (error: any) {
      console.error("Agent Orchestration Error:", error);
      res.status(500).json({ error: "AI Service Error", details: error.message });
    }
  });

  app.post("/api/deck", async (req: Request, res: Response) => {
    try {
      const { blueprint } = req.body;
      if (!blueprint) return res.status(400).json({ error: "Blueprint is required" });
      const deck = await generatePitchDeck(blueprint);
      res.json(deck);
    } catch (error: any) {
      console.error("Pitch Deck Generation Error:", error);
      res.status(500).json({ error: "Deck Service Error", details: error.message });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", environment: process.env.NODE_ENV, provider: "groq-deepseek" });
  });

  // Vite/Static serving
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running in ${isProd ? 'production' : 'development'} mode on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
