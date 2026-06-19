import { createDb } from "~/server/db";
import { organizations } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = event.context.session;
  const orgId = session.session.activeOrganizationId;
  if (!orgId) {
    throw createError({ statusCode: 400, message: "No active organization" });
  }
  const db = createDb();

  const org = await db.select()
    .from(organizations)
    .where(eq(organizations.id, orgId))
    .limit(1);

  if (!org.length) {
    throw createError({ statusCode: 404, message: "Organization not found" });
  }

  return org[0];
});
