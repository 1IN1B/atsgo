import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { createDb } from "~/server/db";
import * as schema from "~/server/db/schema";

export function getAuth() {
  return betterAuth({
    database: drizzleAdapter(createDb(), {
      provider: "sqlite",
      schema,
      usePlural: true,
    }),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      },
    },
    session: {
      additionalFields: {
        activeOrganizationId: {
          type: "string",
          required: false,
        },
      },
    },
  });
}

export type Auth = ReturnType<typeof getAuth>;
