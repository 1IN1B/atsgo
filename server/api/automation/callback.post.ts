import { createDb } from "~/server/db";
import { automationLogs, candidates, pipelineEntries, jobs } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { event: eventType, orgId, data } = body;

  if (!eventType || !orgId) {
    throw createError({ statusCode: 400, message: "Missing event or orgId" });
  }

  const webhookSecret = useRuntimeConfig().n8nWebhookSecret;
  if (webhookSecret) {
    const headerSecret = event.headers.get("x-n8n-webhook-secret");
    if (headerSecret !== webhookSecret) {
      throw createError({ statusCode: 403, message: "Invalid webhook secret" });
    }
  }

  const db = createDb();

  await db.insert(automationLogs).values({
    id: crypto.randomUUID(),
    orgId,
    event: eventType,
    direction: "in",
    payload: JSON.stringify(body),
    status: "received",
  });

  switch (eventType) {
    case "resume_parsed": {
      await db.update(candidates)
        .set({
          skills: JSON.stringify(data.skills),
          experience: JSON.stringify(data.experience),
          education: JSON.stringify(data.education),
          summary: data.summary,
          aiScore: data.score,
        })
        .where(eq(candidates.id, data.candidateId));
      break;
    }

    case "stage_update": {
      await db.update(pipelineEntries)
        .set({ stageId: data.newStageId })
        .where(eq(pipelineEntries.id, data.pipelineEntryId));
      break;
    }

    case "email_sent": {
      await db.insert(automationLogs).values({
        id: crypto.randomUUID(),
        orgId,
        event: "email_sent",
        direction: "in",
        payload: JSON.stringify(data),
        status: "completed",
      });
      break;
    }

    case "job_board_posted": {
      await db.insert(automationLogs).values({
        id: crypto.randomUUID(),
        orgId,
        event: "job_board_posted",
        direction: "in",
        payload: JSON.stringify(data),
        status: "completed",
      });
      break;
    }

    default: {
      console.log(`Unhandled n8n callback event: ${eventType}`);
    }
  }

  return { success: true, message: `Event ${eventType} processed` };
});
