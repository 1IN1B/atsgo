import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export function createDb() {
  const config = useRuntimeConfig();
  const url = config.tursoDatabaseUrl || process.env.TURSO_DATABASE_URL || "";
  const authToken = config.tursoAuthToken || process.env.TURSO_AUTH_TOKEN || "";

  if (!url) {
    throw new Error("TURSO_DATABASE_URL is not configured. Set it in .env.");
  }

  const client = createClient({ url, authToken });
  return drizzle(client, { schema });
}

export type Db = ReturnType<typeof createDb>;
