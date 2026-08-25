import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import orderRoutes from "./routes/order.routes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "order-service",
    status: "UP",
  });
});

app.use("/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(
    `Order service running on http://localhost:${PORT}`
  );
});