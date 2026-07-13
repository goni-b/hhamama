// scripts/db-seed.mjs — apply supabase/seed.sql to a Postgres DB.
// Usage: SUPABASE_DB_URL="postgresql://..." node scripts/db-seed.mjs
// (db-url is Supabase → Project Settings → Database → Connection string → URI)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error("Set SUPABASE_DB_URL first.");
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(here, "..", "supabase", "seed.sql"), "utf8");

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();
try {
  await client.query(sql);
  console.log("✓ seed applied");
} catch (e) {
  console.error("✗ seed failed:", e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
