// filepath: backend/db.ts

import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

// ✅ Explicitly load .env from backend folder
dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log("Loaded DB ENV:", {
  PGUSER: process.env.PGUSER,
  PGHOST: process.env.PGHOST,
  PGDATABASE: process.env.PGDATABASE,
  PGPASSWORD: process.env.PGPASSWORD,
  PGPORT: process.env.PGPORT,
});

// ✅ Environment check
if (!process.env.PGPASSWORD || typeof process.env.PGPASSWORD !== "string") {
  throw new Error("Database password (PGPASSWORD) must be set and must be a string.");
}

// ✅ PostgreSQL connection using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Neon and SSL-based hosts
});

console.log("✅ PostgreSQL pool initialized");

export const query = (text: string, params?: any[]) => {
  console.log("Running SQL:", text);
  console.log("With params:", params);
  return pool.query(text, params);
};

export default pool;
