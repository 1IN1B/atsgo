import { createDb } from "~/server/db";
import { candidates } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = event.context.session;
  const orgId = session.session.activeOrganizationId || session.user.id;
  const candidateId = getRouterParam(event, "id")!;
  const body = await readBody(event);
  const db = createDb();

  const existing = await db.select()
    .from(candidates)
    .where(and(eq(candidates.id, candidateId), eq(candidates.orgId, orgId)))
    .limit(1);

  if (!existing.length) {
    throw createError({ statusCode: 404, message: "Candidate not found" });
  }

  await db.update(candidates)
    .set({
      name: body.name,
      phone: body.phone,
      skills: body.skills,
      experience: body.experience,
      education: body.education,
      summary: body.summary,
    })
    .where(eq(candidates.id, candidateId));

  return { success: true };
});
