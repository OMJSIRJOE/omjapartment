import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

const sql = neon(url);
try {
  const rows = await sql`SELECT COUNT(*)::int AS c FROM "Property"`;
  console.log("HTTP_OK", rows);
} catch (e) {
  console.error("HTTP_FAIL", e instanceof Error ? e.message : e);
  process.exit(1);
}
