import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

// Create a new PostgreSQL connection pool with cloud-resilient SSL
const isRemoteDb = Boolean(
  connectionString.includes('supabase') || 
  connectionString.includes('render') || 
  connectionString.includes('neon') || 
  connectionString.includes('amazonaws')
);

const pool = new pg.Pool({ 
  connectionString,
  ssl: isRemoteDb ? { rejectUnauthorized: false } : undefined,
});

// Wrap the pool with Prisma's pg adapter
const adapter = new PrismaPg(pool);

// Instantiate PrismaClient with the adapter
export const prisma = new PrismaClient({ adapter });
