import { createDb } from "~/server/db";
import { jobs } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = event.context.session;
  const orgId = session.session.activeOrganizationId || session.user.id;
  const jobId = getRouterParam(event, "id")!;
  const db = createDb();

  const existing = await db.select()
    .from(jobs)
    .where(and(eq(jobs.id, jobId), eq(jobs.orgId, orgId)))
    .limit(1);

  if (!existing.length) {
    throw createError({ statusCode: 404, message: "Job not found" });
  }

  await db.delete(jobs).where(eq(jobs.id, jobId));

  return { success: true };
});
