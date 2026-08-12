import { Pool } from "pg";
import { env } from "@insurance/config";

export const db = new Pool({

    host: env.postgres.host,

    port: env.postgres.port,

    database: env.postgres.database,

    user: env.postgres.username,

    password: env.postgres.password

});