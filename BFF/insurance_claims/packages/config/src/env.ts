import dotenv from "dotenv";

dotenv.config();

export const env = {

    postgres: {

        host: process.env.POSTGRES_HOST!,

        port: Number(process.env.POSTGRES_PORT),

        database: process.env.POSTGRES_DB!,

        username: process.env.POSTGRES_USER!,

        password: process.env.POSTGRES_PASSWORD!

    },

    redis: {

        host: process.env.REDIS_HOST!,

        port: Number(process.env.REDIS_PORT)

    },

    jwt: {

        secret: process.env.JWT_SECRET!,

        refreshSecret: process.env.JWT_REFRESH_SECRET!

    },

    bff: {

        port: Number(process.env.BFF_PORT)

    }

};