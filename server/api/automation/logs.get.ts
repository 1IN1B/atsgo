import { createDb } from "~/server/db";
import { automationLogs } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = event.context.session;
  const orgId = session.session.activeOrganizationId || session.user.id;
  const query = getQuery(event);
  const limit = Number(query.limit) || 50;

  const db = createDb();

  const logs = await db.select()
    .from(automationLogs)
    .where(eq(automationLogs.orgId, orgId))
    .orderBy(desc(automationLogs.createdAt))
    .limit(limit);

  return logs;
});
