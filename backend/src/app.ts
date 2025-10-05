import express from "express";
import cors from "cors";
import { config } from "./config.js";
import ideasRouter from "./routes/ideas.js";

export function createApp() {
  const app = express();
  app.set("trust proxy", true);
  app.use(cors({ origin: config.cors.origin }));
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/ideas", ideasRouter);

  // Global error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "INTERNAL_ERROR" });
  });

  return app;
}
