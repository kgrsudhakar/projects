import express from "express";
import cors from "cors";
import morgan from "morgan";
import orderRoutes from "./routes/order.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (req, res) => res.json({ status: "ok", service: "order-service" }));

  app.use("/api/orders", orderRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
