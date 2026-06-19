import { createDb } from "~/server/db";
import { automationLogs } from "~/server/db/schema";

interface N8nPayload {
  event: string;
  orgId: string;
  data: Record<string, unknown>;
}

export async function sendN8nWebhook(payload: N8nPayload): Promise<{ success: boolean; response?: unknown }> {
  const baseUrl = useRuntimeConfig().n8nBaseUrl;
  const apiKey = useRuntimeConfig().n8nApiKey;

  if (!baseUrl) {
    console.warn("N8N_BASE_URL not configured, skipping webhook");
    return { success: false };
  }

  try {
    const response = await $fetch(`${baseUrl}/webhook/${payload.event}`, {
      method: "POST",
      headers: apiKey ? { "X-N8N-API-KEY": apiKey } : {},
      body: payload,
    });

    await logAutomation({
      orgId: payload.orgId,
      event: payload.event,
      direction: "out",
      payload: JSON.stringify(payload),
      response: JSON.stringify(response),
      status: "sent",
    });

    return { success: true, response };
  } catch (error) {
    await logAutomation({
      orgId: payload.orgId,
      event: payload.event,
      direction: "out",
      payload: JSON.stringify(payload),
      response: String(error),
      status: "failed",
    });

    console.error(`n8n webhook failed for event ${payload.event}:`, error);
    return { success: false };
  }
}

async function logAutomation(log: {
  orgId: string;
  event: string;
  direction: string;
  payload?: string;
  response?: string;
  status: string;
}) {
  const db = createDb();
  await db.insert(automationLogs).values({
    id: crypto.randomUUID(),
    orgId: log.orgId,
    event: log.event,
    direction: log.direction,
    payload: log.payload,
    response: log.response,
    status: log.status,
  });
}
