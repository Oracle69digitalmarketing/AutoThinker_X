import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);
  const isProd = process.env.NODE_ENV === "production";

  // Security and performance middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for Vite dev HMR if needed, or configure properly
  }));
  app.use(compression());
  app.use(morgan("dev"));
  app.use(cors());
  app.use(express.json());

  // AI Gateway Endpoint
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, history, systemPrompt } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt || "You are AutoThinker X, a sophisticated AI assistant.",
          },
          ...(history || []),
          {
            role: "user",
            content: message,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 4096,
      });

      const responseContent = completion.choices[0]?.message?.content || "";
      res.json({ content: responseContent });
    } catch (error: any) {
      console.error("Groq API Error:", error);
      res.status(500).json({ 
        error: "AI Service Error", 
        details: error.message 
      });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", environment: process.env.NODE_ENV });
  });

  // Vite middleware for development vs static for production
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
