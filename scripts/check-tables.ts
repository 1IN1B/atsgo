import "dotenv/config";
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const tables = await client.execute("SELECT name, sql FROM sqlite_master WHERE type = 'table'");
for (const row of tables.rows) {
  console.log(`\n=== ${row.name} ===`);
  console.log(row.sql);
}
