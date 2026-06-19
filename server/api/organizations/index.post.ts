import { createDb } from "~/server/db";
import { organizations, userOrganizations, sessions } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = event.context.session;
  const userId = session.user.id;
  const body = await readBody(event);
  const db = createDb();

  const orgId = crypto.randomUUID();

  await db.insert(organizations).values({
    id: orgId,
    name: body.name,
    slug: body.slug,
  });

  await db.insert(userOrganizations).values({
    id: crypto.randomUUID(),
    userId,
    organizationId: orgId,
    role: "owner",
  });

  await db.update(sessions)
    .set({ activeOrganizationId: orgId })
    .where(eq(sessions.id, session.session.id));

  return { id: orgId, name: body.name, slug: body.slug };
});