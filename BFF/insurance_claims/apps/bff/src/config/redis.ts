import { createClient } from "redis";

export const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }

});

redisClient.on("error", err => {
    console.error("Redis Error:", err);

});

export async function connectRedis() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log("Redis Connected");
    }

}