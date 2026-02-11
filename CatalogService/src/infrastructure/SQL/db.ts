import { Pool } from "pg";

const pool = new Pool({
    user: process.env.DB_USER || "nestjsuser",
    host: process.env.DB_HOST || "nest-postgres",
    database: process.env.DB_NAME || "fleamarket",
    password: process.env.DB_PASSWORD || "nestjsuser",
    port: parseInt(process.env.DB_PORT || "5432"),
});

export default pool;