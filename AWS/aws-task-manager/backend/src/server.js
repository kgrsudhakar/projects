import app from "./app.js";
import { config } from "./config.js";
import { pool } from "./db.js";
import { connectRedis } from "./redis.js";

async function start() {
  await pool.query("SELECT 1");
  console.log("PostgreSQL connected");

  await connectRedis();
  console.log("Redis connected");

  app.listen(config.port, () => {
    console.log(`API running on http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error("Startup failed:", error);
  process.exit(1);
});
