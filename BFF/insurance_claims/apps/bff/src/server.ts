import app from "./app.js";
import { env } from "./config/env.js";

import dotenv from "dotenv";
import { connectRedis } from "./config/redis.js";
import express from "express";
import cookieParser from "cookie-parser";

dotenv.config();

await connectRedis();

app.use(express.json());
app.use(cookieParser());

app.listen(env.port, () => {
    console.log(
        `Server started at http://localhost:${env.port}`
    );
});