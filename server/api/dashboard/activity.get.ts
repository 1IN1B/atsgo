import { createDb } from "~/server/db";
import { activities } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = event.context.session;
  const orgId = session.session.activeOrganizationId || session.user.id;
  const query = getQuery(event);
  const limit = Number(query.limit) || 20;

  const db = createDb();

  const recent = await db.select()
    .from(activities)
    .where(eq(activities.orgId, orgId))
    .orderBy(desc(activities.createdAt))
    .limit(limit);

  return recent;
});
