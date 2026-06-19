import { createDb } from "~/server/db";
import { userOrganizations, sessions } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = event.context.session;
  const userId = session.user.id;
  const body = await readBody(event);
  const db = createDb();

  const membership = await db.select()
    .from(userOrganizations)
    .where(and(
      eq(userOrganizations.userId, userId),
      eq(userOrganizations.organizationId, body.organizationId),
    ))
    .limit(1);

  if (!membership.length) {
    throw createError({ statusCode: 403, message: "Not a member of this organization" });
  }

  await db.update(sessions)
    .set({ activeOrganizationId: body.organizationId })
    .where(eq(sessions.id, session.session.id));

  return { activeOrganizationId: body.organizationId };
});