import { getCandidateById, updateCandidate, deleteCandidate } from "@/lib/candidates";
import { emitWebhook } from "@/lib/webhooks";
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const candidate = await getCandidateById(id);
  if (!candidate) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(candidate);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = await getCandidateById(id);
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await request.json();
    const updated = await updateCandidate(id, body);
    if (!updated) return Response.json({ error: "Update failed" }, { status: 500 });

    // Fire n8n webhooks on status changes that trigger automations
    if (body.status && body.status !== existing.status) {
      if (body.status === "shortlisted") {
        await emitWebhook("candidate.shortlisted", updated);
      } else if (body.status === "interview_scheduled") {
        await emitWebhook("candidate.interview_scheduled", updated);
      }
    }

    return Response.json(updated);
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await deleteCandidate(id);
  if (!deleted) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
