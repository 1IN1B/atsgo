import "dotenv/config";
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const dropStatements = [
  "DROP TABLE IF EXISTS comments",
  "DROP TABLE IF EXISTS tickets",
  "DROP TABLE IF EXISTS organization_members",
  "DROP TABLE IF EXISTS organizations",
  "DROP TABLE IF EXISTS users",
];

for (const sql of dropStatements) {
  try {
    await client.execute(sql);
    console.log("Dropped:", sql.match(/DROP TABLE IF EXISTS (\w+)/)?.[1]);
  } catch (e: any) {
    console.log("Error:", e.message?.substring(0, 80));
  }
}

const recreateOrgs = `CREATE TABLE organizations (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, plan TEXT DEFAULT 'free', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`;
try {
  await client.execute(recreateOrgs);
  console.log("Created: organizations (atsgo version)");
} catch (e: any) {
  console.log("Orgs error:", e.message?.substring(0, 80));
}

const finalTables = await client.execute("SELECT name FROM sqlite_master WHERE type = 'table'");
console.log("Final tables:", finalTables.rows.map(r => r.name));
