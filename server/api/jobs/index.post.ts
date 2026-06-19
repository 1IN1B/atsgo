import { createDb } from "~/server/db";
import { jobs } from "~/server/db/schema";
import { sendN8nWebhook } from "~/server/utils/n8n";
import { validate, createJobSchema } from "~/server/utils/validation";

export default defineEventHandler(async (event) => {
  const session = event.context.session;
  const db = createDb();
  const rawBody = await readBody(event);
  const body = validate(createJobSchema, rawBody);

  if (!body.orgId) {
    body.orgId = session.session.activeOrganizationId || session.user.id;
  }

  const id = crypto.randomUUID();

  await db.insert(jobs).values({
    id,
    orgId: body.orgId,
    title: body.title,
    department: body.department,
    location: body.location,
    type: body.type,
    description: body.description,
    requirements: body.requirements,
    salaryMin: body.salaryMin,
    salaryMax: body.salaryMax,
    status: body.status,
    createdBy: session.user.id,
  });

  if (body.status === "published") {
    await sendN8nWebhook({
      event: "job_published",
      orgId: body.orgId,
      data: { jobId: id, title: body.title },
    });
  }

  return { id, success: true };
});
