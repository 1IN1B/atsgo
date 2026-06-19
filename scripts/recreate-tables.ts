import "dotenv/config";
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const drops = [
  "DROP TABLE IF EXISTS activities",
  "DROP TABLE IF EXISTS automation_logs",
  "DROP TABLE IF EXISTS pipeline_entries",
  "DROP TABLE IF EXISTS pipeline_stages",
  "DROP TABLE IF EXISTS applications",
  "DROP TABLE IF EXISTS candidates",
  "DROP TABLE IF EXISTS jobs",
];

for (const sql of drops) {
  try {
    await client.execute(sql);
    console.log("Dropped:", sql.match(/DROP TABLE IF EXISTS (\w+)/)?.[1]);
  } catch (e: any) {
    console.log("Error:", e.message?.substring(0, 60));
  }
}

const creates = [
  `CREATE TABLE jobs (id TEXT PRIMARY KEY, org_id TEXT NOT NULL REFERENCES organizations(id), title TEXT NOT NULL, department TEXT, location TEXT, type TEXT, status TEXT DEFAULT 'draft', description TEXT, requirements TEXT, salary_min INTEGER, salary_max INTEGER, created_by TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE candidates (id TEXT PRIMARY KEY, org_id TEXT NOT NULL REFERENCES organizations(id), name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, skills TEXT, experience TEXT, education TEXT, source TEXT, summary TEXT, ai_score INTEGER, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE applications (id TEXT PRIMARY KEY, org_id TEXT NOT NULL REFERENCES organizations(id), candidate_id TEXT NOT NULL REFERENCES candidates(id), job_id TEXT NOT NULL REFERENCES jobs(id), resume_url TEXT, cover_letter TEXT, source TEXT, status TEXT DEFAULT 'applied', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE pipeline_stages (id TEXT PRIMARY KEY, org_id TEXT NOT NULL REFERENCES organizations(id), name TEXT NOT NULL, "order" INTEGER NOT NULL, color TEXT DEFAULT '#6B7280', is_default INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE pipeline_entries (id TEXT PRIMARY KEY, org_id TEXT NOT NULL REFERENCES organizations(id), candidate_id TEXT NOT NULL REFERENCES candidates(id), job_id TEXT NOT NULL REFERENCES jobs(id), application_id TEXT REFERENCES applications(id), stage_id TEXT NOT NULL REFERENCES pipeline_stages(id), position INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE activities (id TEXT PRIMARY KEY, org_id TEXT NOT NULL REFERENCES organizations(id), user_id TEXT, action TEXT NOT NULL, entity TEXT NOT NULL, entity_id TEXT, details TEXT, created_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE automation_logs (id TEXT PRIMARY KEY, org_id TEXT NOT NULL REFERENCES organizations(id), event TEXT NOT NULL, direction TEXT NOT NULL, n8n_workflow_id TEXT, payload TEXT, response TEXT, status TEXT DEFAULT 'pending', created_at TEXT DEFAULT (datetime('now')))`,
];

for (const sql of creates) {
  try {
    await client.execute(sql);
    const name = sql.match(/CREATE TABLE (\w+)/)?.[1];
    console.log("Created:", name);
  } catch (e: any) {
    console.log("Error:", e.message?.substring(0, 80));
  }
}

const finalTables = await client.execute("SELECT name FROM sqlite_master WHERE type = 'table'");
console.log("Final tables:", finalTables.rows.map(r => r.name));
