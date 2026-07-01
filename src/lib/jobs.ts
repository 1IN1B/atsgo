import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/db";

// ─── Attributes ──────────────────────────────────────────────────────────────

export interface JobAttributes {
  id: string;
  title: string;
  department: string | null;
  description: string | null;
  status: "open" | "closed";
  createdAt: string;
}

type JobCreationAttributes = Optional<
  JobAttributes,
  "id" | "createdAt" | "department" | "description"
>;

// ─── Model ───────────────────────────────────────────────────────────────────

export class JobModel extends Model<JobAttributes, JobCreationAttributes>
  implements JobAttributes {
  declare id: string;
  declare title: string;
  declare department: string | null;
  declare description: string | null;
  declare status: "open" | "closed";
  declare createdAt: string;
}

JobModel.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    title: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM("open", "closed"), allowNull: false, defaultValue: "open" },
    createdAt: { type: DataTypes.STRING, allowNull: false, defaultValue: () => new Date().toISOString() },
  },
  { sequelize, modelName: "Job", tableName: "jobs", timestamps: false }
);

// ─── Public Job shape ────────────────────────────────────────────────────────

export interface Job {
  id: string;
  title: string;
  department?: string;
  description?: string;
  status: "open" | "closed";
  createdAt: string;
}

function toJob(m: JobModel): Job {
  return {
    id: m.id,
    title: m.title,
    department: m.department ?? undefined,
    description: m.description ?? undefined,
    status: m.status,
    createdAt: m.createdAt,
  };
}

async function sync() {
  await JobModel.sync();
}

// ─── CRUD helpers ─────────────────────────────────────────────────────────────

export async function getJobs(): Promise<Job[]> {
  await sync();
  const rows = await JobModel.findAll({ order: [["createdAt", "DESC"]] });
  return rows.map(toJob);
}

export async function getJobById(id: string): Promise<Job | null> {
  await sync();
  const row = await JobModel.findByPk(id);
  return row ? toJob(row) : null;
}

export async function createJob(data: Omit<Job, "id" | "createdAt">): Promise<Job> {
  await sync();
  const row = await JobModel.create({
    title: data.title,
    department: data.department ?? null,
    description: data.description ?? null,
    status: data.status ?? "open",
    createdAt: new Date().toISOString(),
  });
  return toJob(row);
}

export async function updateJob(
  id: string,
  data: Partial<Omit<Job, "id" | "createdAt">>
): Promise<Job | null> {
  await sync();
  const row = await JobModel.findByPk(id);
  if (!row) return null;

  const updates: Partial<JobAttributes> = {};
  if (data.title !== undefined) updates.title = data.title;
  if (data.department !== undefined) updates.department = data.department ?? null;
  if (data.description !== undefined) updates.description = data.description ?? null;
  if (data.status !== undefined) updates.status = data.status;

  await row.update(updates);
  return toJob(row);
}

export async function deleteJob(id: string): Promise<boolean> {
  await sync();
  const deleted = await JobModel.destroy({ where: { id } });
  return deleted > 0;
}
