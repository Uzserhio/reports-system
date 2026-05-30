import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgres://sroy_user:sroy_password@localhost:5432/sroy_db';

async function test() {
  const sql = postgres(connectionString);
  const result = await sql`SELECT 1 as result`;
  console.log('Result:', result);
  process.exit(0);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
