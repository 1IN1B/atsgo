import { createDb } from "~/server/db";
import { organizations } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = event.context.session;
  const orgId = session.session.activeOrganizationId;
  if (!orgId) {
    throw createError({ statusCode: 400, message: "No active organization" });
  }
  const body = await readBody(event);
  const db = createDb();

  await db.update(organizations)
    .set({
      name: body.name,
      slug: body.slug,
    })
    .where(eq(organizations.id, orgId));

  return { success: true };
});
