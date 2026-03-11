import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/src/db/schema';

// Create the connection
const sql = neon(process.env.DATABASE_URL!);
// Pass schema to drizzle to type results
export const db = drizzle(sql, { schema });
