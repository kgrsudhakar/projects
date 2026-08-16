import express from "express";
import cors from "cors";
import morgan from "morgan";
import productRoutes from "./routes/product.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

/**
 * APP ASSEMBLY
 * ------------
 * This is the only file that knows about the FULL middleware chain.
 * Order matters:
 *   1. Cross-cutting middleware (cors, json body parsing, logging)
 *   2. Routes
 *   3. 404 handler (catches anything no route matched)
 *   4. Error handler (MUST be last - Express identifies it by arity)
 */
export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (req, res) => res.json({ status: "ok", service: "product-service" }));

  app.use("/api/products", productRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
