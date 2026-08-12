import dotenv from "dotenv";

dotenv.config();

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
    port: Number(process.env.PORT),
    nodeEnv: process.env.NODE_ENV,
    jwtSecret: getEnv("JWT_SECRET"),
    jwtRefreshSecret: getEnv("JWT_REFRESH_SECRET"),
    databaseUrl: process.env.DATABASE_URL

};