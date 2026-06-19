import { createDb } from "~/server/db";
import { candidates } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = event.context.session;
  const orgId = session.session.activeOrganizationId || session.user.id;
  const candidateId = getRouterParam(event, "id")!;
  const db = createDb();

  const candidate = await db.select()
    .from(candidates)
    .where(and(eq(candidates.id, candidateId), eq(candidates.orgId, orgId)))
    .limit(1);

  if (!candidate.length) {
    throw createError({ statusCode: 404, message: "Candidate not found" });
  }

  return candidate[0];
});
