import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  plan: text("plan").default("free"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const jobs = sqliteTable("jobs", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organizations.id).notNull(),
  title: text("title").notNull(),
  department: text("department"),
  location: text("location"),
  type: text("type"),
  status: text("status").default("draft"),
  description: text("description"),
  requirements: text("requirements"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  createdBy: text("created_by"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const candidates = sqliteTable("candidates", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  skills: text("skills"),
  experience: text("experience"),
  education: text("education"),
  source: text("source"),
  summary: text("summary"),
  aiScore: integer("ai_score"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const applications = sqliteTable("applications", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organizations.id).notNull(),
  candidateId: text("candidate_id").references(() => candidates.id).notNull(),
  jobId: text("job_id").references(() => jobs.id).notNull(),
  resumeUrl: text("resume_url"),
  coverLetter: text("cover_letter"),
  source: text("source"),
  status: text("status").default("applied"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const pipelineStages = sqliteTable("pipeline_stages", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  order: integer("order").notNull(),
  color: text("color").default("#6B7280"),
  isDefault: integer("is_default").default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const pipelineEntries = sqliteTable("pipeline_entries", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organizations.id).notNull(),
  candidateId: text("candidate_id").references(() => candidates.id).notNull(),
  jobId: text("job_id").references(() => jobs.id).notNull(),
  applicationId: text("application_id").references(() => applications.id),
  stageId: text("stage_id").references(() => pipelineStages.id).notNull(),
  position: integer("position").default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const activities = sqliteTable("activities", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organizations.id).notNull(),
  userId: text("user_id"),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  details: text("details"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const automationLogs = sqliteTable("automation_logs", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organizations.id).notNull(),
  event: text("event").notNull(),
  direction: text("direction").notNull(),
  n8nWorkflowId: text("n8n_workflow_id"),
  payload: text("payload"),
  response: text("response"),
  status: text("status").default("pending"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  image: text("image"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: text("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  activeOrganizationId: text("active_organization_id"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: text("access_token_expires_at"),
  refreshTokenExpiresAt: text("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const verifications = sqliteTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const userOrganizations = sqliteTable("user_organizations", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  organizationId: text("organization_id").references(() => organizations.id).notNull(),
  role: text("role").default("member"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});
