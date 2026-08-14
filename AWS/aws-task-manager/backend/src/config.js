import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 5000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173"
};

if (!config.databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

if (!config.jwtSecret) {
  throw new Error("JWT_SECRET is required");
}
