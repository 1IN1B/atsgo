import { createDb } from "~/server/db";
import { candidates, applications, pipelineEntries, pipelineStages, jobs } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { sendN8nWebhook } from "~/server/utils/n8n";
import { parseResume, scoreCandidate } from "~/server/utils/ai";
import { validate, applySchema } from "~/server/utils/validation";

export default defineEventHandler(async (event) => {
  const db = createDb();
  const rawBody = await readBody(event);
  const body = validate(applySchema, rawBody);

  const existingCandidate = await db.select()
    .from(candidates)
    .where(and(eq(candidates.email, body.email), eq(candidates.orgId, body.orgId)))
    .limit(1);

  let candidateId: string;

  if (existingCandidate.length) {
    candidateId = existingCandidate[0].id;
  } else {
    candidateId = crypto.randomUUID();
    await db.insert(candidates).values({
      id: candidateId,
      orgId: body.orgId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      source: body.source || "direct",
    });
  }

  const applicationId = crypto.randomUUID();

  await db.insert(applications).values({
    id: applicationId,
    orgId: body.orgId,
    candidateId,
    jobId: body.jobId,
    resumeUrl: body.resumeUrl,
    coverLetter: body.coverLetter,
    source: body.source || "direct",
  });

  const defaultStage = await db.select()
    .from(pipelineStages)
    .where(eq(pipelineStages.orgId, body.orgId))
    .orderBy(pipelineStages.order)
    .limit(1);

  if (defaultStage.length) {
    await db.insert(pipelineEntries).values({
      id: crypto.randomUUID(),
      orgId: body.orgId,
      candidateId,
      jobId: body.jobId,
      applicationId,
      stageId: defaultStage[0].id,
    });
  }

  await sendN8nWebhook({
    event: "new_application",
    orgId: body.orgId,
    data: {
      candidateId,
      applicationId,
      jobId: body.jobId,
      name: body.name,
      email: body.email,
      resumeUrl: body.resumeUrl,
      coverLetter: body.coverLetter,
    },
  });

  try {
    const job = await db.select().from(jobs).where(eq(jobs.id, body.jobId)).limit(1);
    if (job.length && body.coverLetter) {
      const profile = `Name: ${body.name}\nEmail: ${body.email}\nCover Letter: ${body.coverLetter}`;
      const requirements = job[0].requirements || job[0].description || "";
      const scored = await scoreCandidate(profile, requirements);
      await db.update(candidates)
        .set({ aiScore: scored.score, summary: scored.reasoning })
        .where(eq(candidates.id, candidateId));
    }
  } catch (aiErr) {
    console.warn("AI scoring failed, continuing without score:", aiErr);
  }

  return { candidateId, applicationId, success: true };
});
