import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import pg from "pg";

const { Pool } = pg;

// Always prefer the pooler URL (pgbouncer) for reliable connections.
// DIRECT_URL is only needed for migrations, not runtime queries.
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  allowExitOnIdle: false,
});

// Log and recover from unexpected pool errors instead of crashing.
pool.on('error', (err) => {
  console.error('[prisma pool] Unexpected error on idle client:', err.message);
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
