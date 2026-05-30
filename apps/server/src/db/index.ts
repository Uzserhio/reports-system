import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgres://sroy_user:sroy_password@localhost:5432/sroy_db';

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
