import { createDb } from "~/server/db";
import { organizations, userOrganizations } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = event.context.session;
  const userId = session.user.id;
  const db = createDb();

  const rows = await db.select({
    id: organizations.id,
    name: organizations.name,
    slug: organizations.slug,
    plan: organizations.plan,
    role: userOrganizations.role,
    createdAt: organizations.createdAt,
  })
    .from(userOrganizations)
    .innerJoin(organizations, eq(userOrganizations.organizationId, organizations.id))
    .where(eq(userOrganizations.userId, userId));

  return rows;
});