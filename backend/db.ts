// filepath: c:\Users\Liam-Laptop\Documents\GitHub\EVNTgarde\backend\db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables from .env file
dotenv.config();

console.log('Loaded Environment Variables:', {
  PGUSER: process.env.PGUSER,
  PGHOST: process.env.PGHOST,
  PGDATABASE: process.env.PGDATABASE,
  PGPASSWORD: process.env.PGPASSWORD,
  PGPORT: process.env.PGPORT,
});

// Ensure environment variables are properly set
if (!process.env.PGPASSWORD || typeof process.env.PGPASSWORD !== 'string') {
  throw new Error('Database password (PGPASSWORD) must be set and must be a string.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true, // Enable SSL
});

export const query = (text: string, params?: any[]) => {
  console.log('Executing SQL:', text);
  console.log('With parameters:', params);
  return pool.query(text, params);
};

export default pool;