import { createDb } from "~/server/db";
import { jobs } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = event.context.session;
  const orgId = session.session.activeOrganizationId || session.user.id;
  const db = createDb();

  const allJobs = await db.select()
    .from(jobs)
    .where(eq(jobs.orgId, orgId))
    .orderBy(desc(jobs.createdAt));

  return allJobs;
});
