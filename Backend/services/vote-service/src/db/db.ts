import { config } from "dotenv";
config(); // tự động đọc process.env
import { Pool } from "pg";

console.log("===============>", process.env.DB_HOST);
console.log("===============>", process.env.DB_PORT);
console.log("===============>", process.env.DB_NAME);
console.log("===============>", process.env.DB_USER);
console.log("===============>", process.env.DB_PASSWORD);

if (!process.env.DB_PASSWORD) {
  throw new Error("DB_PASSWORD is missing");
}

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10, // số connection tối đa
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
  console.log("===>Connected to PostgreSQL");
});

process.on("SIGTERM", async () => {
  await pool.end();
});

pool.on("error", (err: Error | null) => {
  console.error("Unexpected PG error", err);
  process.exit(1);
});