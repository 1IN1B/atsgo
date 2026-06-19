import { createDb } from "~/server/db";
import { jobs } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { sendN8nWebhook } from "~/server/utils/n8n";
import { validate, updateJobSchema } from "~/server/utils/validation";

export default defineEventHandler(async (event) => {
  const session = event.context.session;
  const orgId = session.session.activeOrganizationId || session.user.id;
  const db = createDb();
  const jobId = getRouterParam(event, "id")!;
  const rawBody = await readBody(event);
  const body = validate(updateJobSchema, rawBody);

  const existing = await db.select()
    .from(jobs)
    .where(and(eq(jobs.id, jobId), eq(jobs.orgId, orgId)))
    .limit(1);

  if (!existing.length) {
    throw createError({ statusCode: 404, message: "Job not found" });
  }

  const previousStatus = existing[0].status;
  const newStatus = body.status || previousStatus;

  await db.update(jobs)
    .set({
      title: body.title,
      department: body.department,
      location: body.location,
      type: body.type,
      description: body.description,
      requirements: body.requirements,
      salaryMin: body.salaryMin,
      salaryMax: body.salaryMax,
      status: newStatus,
    })
    .where(eq(jobs.id, jobId));

  if (previousStatus !== "published" && newStatus === "published") {
    await sendN8nWebhook({
      event: "job_published",
      orgId: existing[0].orgId,
      data: { jobId, title: body.title || existing[0].title },
    });
  }

  return { success: true };
});
