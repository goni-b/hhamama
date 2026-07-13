// scripts/db-apply.mjs — apply an arbitrary SQL file to the DB.
// Usage: SUPABASE_DB_URL="postgresql://..." node scripts/db-apply.mjs <path-to.sql>
import { readFileSync } from "node:fs";
import pg from "pg";

const url = process.env.SUPABASE_DB_URL;
const file = process.argv[2];
if (!url || !file) {
  console.error("Usage: SUPABASE_DB_URL=... node scripts/db-apply.mjs <file.sql>");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();
try {
  await client.query(readFileSync(file, "utf8"));
  console.log(`✓ applied ${file}`);
} catch (e) {
  console.error(`✗ ${file} failed:`, e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
