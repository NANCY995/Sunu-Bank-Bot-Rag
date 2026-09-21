import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import app, { getLocalNetworkIp } from "./api/index";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config();

export { getLocalNetworkIp };

async function startServer() {
  const PORT = Number(process.env.PORT || 3000);

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    const ip = getLocalNetworkIp();
    console.log(`SUNU Bank Togo Bancassurance Portal running on http://localhost:${PORT} (LAN: http://${ip}:${PORT})`);
  });
}

startServer();
