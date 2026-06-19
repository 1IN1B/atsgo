import { createDb } from "~/server/db";
import { candidates } from "~/server/db/schema";
import { eq, desc, like, or, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = event.context.session;
  const orgId = session.session.activeOrganizationId || session.user.id;
  const query = getQuery(event);
  const search = query.search as string;
  const limit = Number(query.limit) || 50;
  const offset = Number(query.offset) || 0;

  const db = createDb();

  let result;
  if (search) {
    result = await db.select()
      .from(candidates)
      .where(and(
        eq(candidates.orgId, orgId),
        or(like(candidates.name, `%${search}%`), like(candidates.email, `%${search}%`), like(candidates.skills, `%${search}%`))
      ))
      .orderBy(desc(candidates.createdAt))
      .limit(limit)
      .offset(offset);
  } else {
    result = await db.select()
      .from(candidates)
      .where(eq(candidates.orgId, orgId))
      .orderBy(desc(candidates.createdAt))
      .limit(limit)
      .offset(offset);
  }

  return result;
});
