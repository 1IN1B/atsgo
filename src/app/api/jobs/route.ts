import { getJobs, createJob } from "@/lib/jobs";

export async function GET() {
  const jobs = await getJobs();
  jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return Response.json(jobs);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, department, description, status } = body;

    if (!title) {
      return Response.json({ error: "title is required" }, { status: 400 });
    }

    const job = await createJob({
      title,
      department,
      description,
      status: status ?? "open",
    });

    return Response.json(job, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
}
