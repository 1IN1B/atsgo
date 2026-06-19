import { createDb } from "~/server/db";
import { jobs } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const jobId = getRouterParam(event, "id")!;
  const db = createDb();

  const job = await db.select({
    id: jobs.id,
    orgId: jobs.orgId,
    title: jobs.title,
    department: jobs.department,
    location: jobs.location,
    type: jobs.type,
    description: jobs.description,
    requirements: jobs.requirements,
    salaryMin: jobs.salaryMin,
    salaryMax: jobs.salaryMax,
  })
    .from(jobs)
    .where(and(eq(jobs.id, jobId), eq(jobs.status, "published")))
    .limit(1);

  if (!job.length) {
    throw createError({ statusCode: 404, message: "Job not found or not published" });
  }

  return job[0];
});
