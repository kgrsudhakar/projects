import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  createProxyMiddleware
} from "http-proxy-middleware";
import {
  authenticateToken,
} from "./middleware/authMiddleware";


dotenv.config();

const app = express();

const PORT = 5000;

app.use(cors());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "api-gateway",
    status: "UP"
  });
});

// ============================================
// Auth Service - Public
// ============================================

app.use(
  "/auth",
  createProxyMiddleware({
    target: "http://localhost:5003",
    changeOrigin: true,

    pathRewrite: (path) => {
      return `/auth${path}`;
    },

    on: {
      proxyReq: (proxyReq, req) => {
        console.log(
          `Auth Gateway: ${req.method} ${req.url}`
        );
      },
    },
  })
);


// ============================================
// Product / Order - Protected
// ============================================

app.use(
  "/api",
  authenticateToken,
  createProxyMiddleware({
    changeOrigin: true,

    router: (req) => {

      if (req.url?.startsWith("/products")) {
        return "http://localhost:5001";
      }

      if (req.url?.startsWith("/orders")) {
        return "http://localhost:5002";
      }

      return "http://localhost:5001";
    },

    pathRewrite: {
      "^/api": ""
    }
  })
);

app.listen(PORT, () => {
  console.log(
    `API Gateway running on http://localhost:${PORT}`
  );
});