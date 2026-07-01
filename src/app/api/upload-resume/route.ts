import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const n8nUrl = process.env.N8N_RESUME_WEBHOOK_URL;

  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return Response.json({ error: "No resume file provided" }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return Response.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    // If n8n is configured, forward the file to n8n for AI parsing
    if (n8nUrl) {
      const forwardForm = new FormData();
      forwardForm.append("resume", file);
      forwardForm.append("source", "manual");
      forwardForm.append("filename", file.name);

      // Fire and forget — n8n will create the candidate asynchronously
      fetch(n8nUrl, {
        method: "POST",
        body: forwardForm,
      }).catch((err) => {
        console.error("[upload-resume] Failed to forward to n8n:", err);
      });

      return Response.json({
        queued: true,
        message: "Resume sent for processing. The candidate profile will appear shortly.",
      });
    }

    // n8n not configured — return a helpful message
    return Response.json({
      queued: false,
      message: "n8n webhook not configured. Please set N8N_RESUME_WEBHOOK_URL in Settings.",
    });
  } catch (err) {
    console.error("[upload-resume] Error:", err);
    return Response.json({ error: "Failed to process upload" }, { status: 500 });
  }
}
