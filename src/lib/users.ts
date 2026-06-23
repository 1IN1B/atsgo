export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

import { promises as fs } from "fs";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

async function ensureFile() {
  const dir = path.dirname(USERS_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, "[]", "utf-8");
  }
}

export async function getUsers(): Promise<UserRecord[]> {
  await ensureFile();
  const data = await fs.readFile(USERS_FILE, "utf-8");
  return JSON.parse(data);
}

async function saveUsers(users: UserRecord[]) {
  await ensureFile();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export async function createUser(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const users = await getUsers();
  if (users.find((u) => u.email === email)) {
    return { success: false, error: "Email already exists" };
  }
  const user: UserRecord = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await saveUsers(users);
  return { success: true };
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const users = await getUsers();
  const user = users.find((u) => u.email === email);
  return user || null;
}

export async function verifyPassword(email: string, password: string): Promise<boolean> {
  const users = await getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  return !!user;
}
