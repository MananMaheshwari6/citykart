import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import cityRoutes from "./routes/cityRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";

export function createApp() {
  const app = express();
  const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:8080";
  app.use(
    cors({
      origin: corsOrigin.split(",").map((s) => s.trim()),
      credentials: true,
    })
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/auth", authRoutes);
  app.use("/cities", cityRoutes);
  app.use("/products", productRoutes);
  app.use("/cart", cartRoutes);
  app.use("/orders", orderRoutes);
  app.use("/vendor", vendorRoutes);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}
