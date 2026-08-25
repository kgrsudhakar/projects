import express from "express";

import cors from "cors";

import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";

import { pool } from "./config/db";


dotenv.config();


const app = express();

const PORT =
  Number(process.env.PORT) || 5003;


app.use(cors());

app.use(express.json());


app.get("/health", async (
  req,
  res
) => {

  try {

    await pool.query(
      "SELECT 1"
    );

    res.json({
      success: true,
      service: "auth-service",
      status: "UP",
      database: "connected",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      service: "auth-service",
      status: "DOWN",
      database: "disconnected",
    });

  }

});


app.use(
  "/auth",
  authRoutes
);


app.listen(
  PORT,
  () => {

    console.log(
      `Auth Service running on http://localhost:${PORT}`
    );

  }
);