import { getCandidates, createCandidate } from "@/lib/candidates";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status") as
    | "applied"
    | "shortlisted"
    | "interview_scheduled"
    | "offered"
    | "rejected"
    | null;

  const candidates = await getCandidates(status ?? undefined);
  // Sort newest first
  candidates.sort(
    (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
  );
  return Response.json(candidates);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, skills, summary, resumeFileName, source, status, jobId, notes } =
      body;

    if (!name || !email) {
      return Response.json({ error: "name and email are required" }, { status: 400 });
    }

    const candidate = await createCandidate({
      name,
      email,
      phone,
      skills: skills ?? [],
      summary,
      resumeFileName,
      source: source ?? "manual",
      status: status ?? "applied",
      jobId,
      notes,
    });

    return Response.json(candidate, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
}
