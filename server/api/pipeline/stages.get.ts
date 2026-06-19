import { createDb } from "~/server/db";
import { pipelineStages } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = event.context.session;
  const orgId = session.session.activeOrganizationId || session.user.id;
  const db = createDb();

  const stages = await db.select()
    .from(pipelineStages)
    .where(eq(pipelineStages.orgId, orgId));

  if (stages.length === 0) {
    const defaults = [
      { id: crypto.randomUUID(), orgId, name: "Applied", order: 0, color: "#3B82F6", isDefault: 1 },
      { id: crypto.randomUUID(), orgId, name: "Screening", order: 1, color: "#8B5CF6" },
      { id: crypto.randomUUID(), orgId, name: "Interview", order: 2, color: "#F59E0B" },
      { id: crypto.randomUUID(), orgId, name: "Offer", order: 3, color: "#10B981" },
      { id: crypto.randomUUID(), orgId, name: "Hired", order: 4, color: "#22C55E" },
      { id: crypto.randomUUID(), orgId, name: "Rejected", order: 5, color: "#EF4444" },
    ];

    for (const stage of defaults) {
      await db.insert(pipelineStages).values(stage);
    }

    return defaults.sort((a, b) => a.order - b.order);
  }

  return stages.sort((a, b) => a.order - b.order);
});
