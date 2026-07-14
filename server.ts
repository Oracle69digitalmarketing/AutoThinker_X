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
      
      const blueprint = await orchestrateVenture(idea, branding || 'tech-bold');
      res.json(blueprint);
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
