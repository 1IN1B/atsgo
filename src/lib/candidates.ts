import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/db";

// ─── Type definitions ───────────────────────────────────────────────────────

export type CandidateStatus =
  | "applied"
  | "shortlisted"
  | "interview_scheduled"
  | "offered"
  | "rejected";

export interface CandidateAttributes {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  skills: string; // stored as comma-separated; exposed as string[] via helpers
  summary: string | null;
  resumeFileName: string | null;
  source: "gmail" | "manual";
  status: CandidateStatus;
  jobId: string | null;
  appliedAt: string;
  interviewAt: string | null;
  meetLink: string | null;
  notes: string | null;
}

type CandidateCreationAttributes = Optional<
  CandidateAttributes,
  "id" | "appliedAt" | "phone" | "skills" | "summary" | "resumeFileName" | "jobId" | "interviewAt" | "meetLink" | "notes"
>;

// ─── Model ──────────────────────────────────────────────────────────────────

export class CandidateModel extends Model<CandidateAttributes, CandidateCreationAttributes>
  implements CandidateAttributes {
  declare id: string;
  declare name: string;
  declare email: string;
  declare phone: string | null;
  declare skills: string;
  declare summary: string | null;
  declare resumeFileName: string | null;
  declare source: "gmail" | "manual";
  declare status: CandidateStatus;
  declare jobId: string | null;
  declare appliedAt: string;
  declare interviewAt: string | null;
  declare meetLink: string | null;
  declare notes: string | null;
}

CandidateModel.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: true },
    skills: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    summary: { type: DataTypes.TEXT, allowNull: true },
    resumeFileName: { type: DataTypes.STRING, allowNull: true },
    source: { type: DataTypes.ENUM("gmail", "manual"), allowNull: false, defaultValue: "manual" },
    status: {
      type: DataTypes.ENUM("applied", "shortlisted", "interview_scheduled", "offered", "rejected"),
      allowNull: false,
      defaultValue: "applied",
    },
    jobId: { type: DataTypes.STRING, allowNull: true },
    appliedAt: { type: DataTypes.STRING, allowNull: false, defaultValue: () => new Date().toISOString() },
    interviewAt: { type: DataTypes.STRING, allowNull: true },
    meetLink: { type: DataTypes.STRING, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, modelName: "Candidate", tableName: "candidates", timestamps: false }
);

// ─── Public Candidate shape (skills as array) ────────────────────────────────

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  summary?: string;
  resumeFileName?: string;
  source: "gmail" | "manual";
  status: CandidateStatus;
  jobId?: string;
  appliedAt: string;
  interviewAt?: string;
  meetLink?: string;
  notes?: string;
}

function toCandidate(m: CandidateModel): Candidate {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone ?? undefined,
    skills: m.skills ? m.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
    summary: m.summary ?? undefined,
    resumeFileName: m.resumeFileName ?? undefined,
    source: m.source,
    status: m.status,
    jobId: m.jobId ?? undefined,
    appliedAt: m.appliedAt,
    interviewAt: m.interviewAt ?? undefined,
    meetLink: m.meetLink ?? undefined,
    notes: m.notes ?? undefined,
  };
}

async function sync() {
  await CandidateModel.sync();
}

// ─── CRUD helpers ────────────────────────────────────────────────────────────

export async function getCandidates(status?: CandidateStatus): Promise<Candidate[]> {
  await sync();
  const where = status ? { status } : {};
  const rows = await CandidateModel.findAll({ where, order: [["appliedAt", "DESC"]] });
  return rows.map(toCandidate);
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
  await sync();
  const row = await CandidateModel.findByPk(id);
  return row ? toCandidate(row) : null;
}

export async function createCandidate(
  data: Omit<Candidate, "id" | "appliedAt">
): Promise<Candidate> {
  await sync();
  const row = await CandidateModel.create({
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    skills: (data.skills ?? []).join(","),
    summary: data.summary ?? null,
    resumeFileName: data.resumeFileName ?? null,
    source: data.source,
    status: data.status ?? "applied",
    jobId: data.jobId ?? null,
    appliedAt: new Date().toISOString(),
    interviewAt: data.interviewAt ?? null,
    meetLink: data.meetLink ?? null,
    notes: data.notes ?? null,
  });
  return toCandidate(row);
}

export async function updateCandidate(
  id: string,
  data: Partial<Omit<Candidate, "id">>
): Promise<Candidate | null> {
  await sync();
  const row = await CandidateModel.findByPk(id);
  if (!row) return null;

  const updates: Partial<CandidateAttributes> = {};
  if (data.name !== undefined) updates.name = data.name;
  if (data.email !== undefined) updates.email = data.email;
  if (data.phone !== undefined) updates.phone = data.phone ?? null;
  if (data.skills !== undefined) updates.skills = data.skills.join(",");
  if (data.summary !== undefined) updates.summary = data.summary ?? null;
  if (data.resumeFileName !== undefined) updates.resumeFileName = data.resumeFileName ?? null;
  if (data.source !== undefined) updates.source = data.source;
  if (data.status !== undefined) updates.status = data.status;
  if (data.jobId !== undefined) updates.jobId = data.jobId ?? null;
  if (data.interviewAt !== undefined) updates.interviewAt = data.interviewAt ?? null;
  if (data.meetLink !== undefined) updates.meetLink = data.meetLink ?? null;
  if (data.notes !== undefined) updates.notes = data.notes ?? null;

  await row.update(updates);
  return toCandidate(row);
}

export async function deleteCandidate(id: string): Promise<boolean> {
  await sync();
  const deleted = await CandidateModel.destroy({ where: { id } });
  return deleted > 0;
}
