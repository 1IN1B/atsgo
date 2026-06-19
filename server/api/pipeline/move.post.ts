import { createDb } from "~/server/db";
import { pipelineEntries } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { sendN8nWebhook } from "~/server/utils/n8n";
import { validate, pipelineMoveSchema } from "~/server/utils/validation";

export default defineEventHandler(async (event) => {
  const session = event.context.session;
  const db = createDb();
  const rawBody = await readBody(event);
  const body = validate(pipelineMoveSchema, rawBody);

  const existing = await db.select()
    .from(pipelineEntries)
    .where(and(eq(pipelineEntries.id, body.entryId), eq(pipelineEntries.orgId, body.orgId)))
    .limit(1);

  if (!existing.length) {
    throw createError({ statusCode: 404, message: "Pipeline entry not found" });
  }

  const previousStageId = existing[0].stageId;

  await db.update(pipelineEntries)
    .set({ stageId: body.newStageId })
    .where(eq(pipelineEntries.id, body.entryId));

  await sendN8nWebhook({
    event: "stage_changed",
    orgId: body.orgId,
    data: {
      pipelineEntryId: body.entryId,
      candidateId: existing[0].candidateId,
      jobId: existing[0].jobId,
      previousStageId,
      newStageId: body.newStageId,
    },
  });

  return { success: true };
});
