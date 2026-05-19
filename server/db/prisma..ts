import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

// Create a new PostgreSQL connection pool
const pool = new pg.Pool({ connectionString });

// Wrap the pool with Prisma's pg adapter
const adapter = new PrismaPg(pool);

// Instantiate PrismaClient with the adapter
export const prisma = new PrismaClient({ adapter });
