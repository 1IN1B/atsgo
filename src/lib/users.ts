import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/db";

// ─── Attributes ──────────────────────────────────────────────────────────────

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

type UserCreationAttributes = Optional<UserAttributes, "id" | "createdAt">;

// ─── Model ───────────────────────────────────────────────────────────────────

export class UserModel extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  declare id: string;
  declare name: string;
  declare email: string;
  declare password: string;
  declare createdAt: string;
}

UserModel.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.STRING, allowNull: false, defaultValue: () => new Date().toISOString() },
  },
  { sequelize, modelName: "User", tableName: "users", timestamps: false }
);

// ─── Public type (matches what auth.ts expects) ───────────────────────────────

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

async function sync() {
  await UserModel.sync();
}

// ─── CRUD helpers ─────────────────────────────────────────────────────────────

export async function getUsers(): Promise<UserRecord[]> {
  await sync();
  return UserModel.findAll();
}

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  await sync();
  const existing = await UserModel.findOne({ where: { email } });
  if (existing) return { success: false, error: "Email already exists" };

  await UserModel.create({
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  });
  return { success: true };
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  await sync();
  return UserModel.findOne({ where: { email } });
}

export async function verifyPassword(email: string, password: string): Promise<boolean> {
  await sync();
  const user = await UserModel.findOne({ where: { email, password } });
  return !!user;
}
