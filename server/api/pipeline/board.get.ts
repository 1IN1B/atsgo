import { createDb } from "~/server/db";
import { pipelineEntries, pipelineStages, candidates } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = event.context.session;
  const orgId = session.session.activeOrganizationId || session.user.id;
  const query = getQuery(event);
  const jobId = query.jobId as string;

  if (!jobId) {
    throw createError({ statusCode: 400, message: "jobId is required" });
  }

  const db = createDb();

  const stages = await db.select()
    .from(pipelineStages)
    .where(eq(pipelineStages.orgId, orgId));

  const entries = await db.select({
    entry: pipelineEntries,
    candidate: candidates,
  })
    .from(pipelineEntries)
    .innerJoin(candidates, eq(pipelineEntries.candidateId, candidates.id))
    .where(and(eq(pipelineEntries.jobId, jobId), eq(pipelineEntries.orgId, orgId)));

  const grouped: Record<string, typeof entries> = {};
  for (const stage of stages) {
    grouped[stage.id] = entries.filter(e => e.entry.stageId === stage.id);
  }

  return { stages, grouped };
});
