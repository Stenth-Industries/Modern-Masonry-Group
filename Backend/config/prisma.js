import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import pg from "pg";

const { Pool } = pg;

// In serverless (Vercel), use DIRECT_URL to avoid pgBouncer session limits.
// Locally, DATABASE_URL (pooled) is used if DIRECT_URL isn't set.
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

const pool = new Pool({ connectionString, max: 1 });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
