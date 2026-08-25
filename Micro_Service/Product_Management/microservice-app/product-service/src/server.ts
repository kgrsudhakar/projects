import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/product.routes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "product-service",
    status: "UP",
  });
});

app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log(
    `Product service running on http://localhost:${PORT}`
  );
});