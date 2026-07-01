export async function emitWebhook(event: string, payload: object): Promise<void> {
  const url = process.env.N8N_OUTBOUND_WEBHOOK_URL;
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-secret": process.env.N8N_WEBHOOK_SECRET ?? "",
      },
      body: JSON.stringify({
        event,
        payload,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    // Non-fatal — log and continue so app works without n8n
    console.error("[webhook] Failed to emit event:", event, err);
  }
}
