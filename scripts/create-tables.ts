import "dotenv/config";
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const existing = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
console.log("Existing tables:", existing.rows.map(r => r.name));

const statements = [
  `CREATE TABLE IF NOT EXISTS organizations (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, plan TEXT DEFAULT 'free', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, email_verified INTEGER DEFAULT 0, image TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), token TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL, ip_address TEXT, user_agent TEXT, active_organization_id TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE IF NOT EXISTS accounts (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), account_id TEXT NOT NULL, provider_id TEXT NOT NULL, access_token TEXT, refresh_token TEXT, id_token TEXT, access_token_expires_at TEXT, refresh_token_expires_at TEXT, scope TEXT, password TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE IF NOT EXISTS verifications (id TEXT PRIMARY KEY, identifier TEXT NOT NULL, value TEXT NOT NULL, expires_at TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE IF NOT EXISTS user_organizations (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), organization_id TEXT NOT NULL REFERENCES organizations(id), role TEXT DEFAULT 'member', created_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE IF NOT EXISTS jobs (id TEXT PRIMARY KEY, org_id TEXT NOT NULL REFERENCES organizations(id), title TEXT NOT NULL, department TEXT, location TEXT, type TEXT, status TEXT DEFAULT 'draft', description TEXT, requirements TEXT, salary_min INTEGER, salary_max INTEGER, created_by TEXT REFERENCES users(id), created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE IF NOT EXISTS candidates (id TEXT PRIMARY KEY, org_id TEXT NOT NULL REFERENCES organizations(id), name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, skills TEXT, experience TEXT, education TEXT, source TEXT, summary TEXT, ai_score INTEGER, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE IF NOT EXISTS applications (id TEXT PRIMARY KEY, org_id TEXT NOT NULL REFERENCES organizations(id), candidate_id TEXT NOT NULL REFERENCES candidates(id), job_id TEXT NOT NULL REFERENCES jobs(id), resume_url TEXT, cover_letter TEXT, source TEXT, status TEXT DEFAULT 'applied', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE IF NOT EXISTS pipeline_stages (id TEXT PRIMARY KEY, org_id TEXT NOT NULL REFERENCES organizations(id), name TEXT NOT NULL, "order" INTEGER NOT NULL, color TEXT DEFAULT '#6B7280', is_default INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE IF NOT EXISTS pipeline_entries (id TEXT PRIMARY KEY, org_id TEXT NOT NULL REFERENCES organizations(id), candidate_id TEXT NOT NULL REFERENCES candidates(id), job_id TEXT NOT NULL REFERENCES jobs(id), application_id TEXT REFERENCES applications(id), stage_id TEXT NOT NULL REFERENCES pipeline_stages(id), position INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE IF NOT EXISTS activities (id TEXT PRIMARY KEY, org_id TEXT NOT NULL REFERENCES organizations(id), user_id TEXT REFERENCES users(id), action TEXT NOT NULL, entity TEXT NOT NULL, entity_id TEXT, details TEXT, created_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE IF NOT EXISTS automation_logs (id TEXT PRIMARY KEY, org_id TEXT NOT NULL REFERENCES organizations(id), event TEXT NOT NULL, direction TEXT NOT NULL, n8n_workflow_id TEXT, payload TEXT, response TEXT, status TEXT DEFAULT 'pending', created_at TEXT DEFAULT (datetime('now')))`,
];

for (const sql of statements) {
  try {
    await client.execute(sql);
    const name = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1];
    console.log("Created:", name);
  } catch (e: any) {
    console.log("Error:", e.message?.substring(0, 80));
  }
}

const alters = [
  `ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0`,
];

for (const sql of alters) {
  try {
    await client.execute(sql);
    console.log("Altered:", sql.match(/ALTER TABLE (\w+) ADD COLUMN (\w+)/)?.slice(1).join("."));
  } catch (e: any) {
    console.log("Alter skipped:", e.message?.substring(0, 80));
  }
}

const finalTables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
console.log("All tables:", finalTables.rows.map(r => r.name));
