import { createDb } from "~/server/db";
import { jobs, applications, pipelineEntries, pipelineStages } from "~/server/db/schema";
import { eq, and, count, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = event.context.session;
  const orgId = session.session.activeOrganizationId || session.user.id;

  const db = createDb();

  const activeJobs = await db.select({ count: count() })
    .from(jobs)
    .where(and(eq(jobs.orgId, orgId), eq(jobs.status, "published")));

  const totalApplications = await db.select({ count: count() })
    .from(applications)
    .where(eq(applications.orgId, orgId));

  const interviewStage = await db.select({ id: pipelineStages.id })
    .from(pipelineStages)
    .where(and(eq(pipelineStages.orgId, orgId), sql`${pipelineStages.name} LIKE '%interview%'`))
    .limit(1);

  const interviews = interviewStage.length
    ? await db.select({ count: count() })
        .from(pipelineEntries)
        .where(and(eq(pipelineEntries.orgId, orgId), eq(pipelineEntries.stageId, interviewStage[0].id)))
    : [{ count: 0 }];

  const hiredStage = await db.select({ id: pipelineStages.id })
    .from(pipelineStages)
    .where(and(eq(pipelineStages.orgId, orgId), sql`${pipelineStages.name} LIKE '%hired%'`))
    .limit(1);

  const hired = hiredStage.length
    ? await db.select({ count: count() })
        .from(pipelineEntries)
        .where(and(eq(pipelineEntries.orgId, orgId), eq(pipelineEntries.stageId, hiredStage[0].id)))
    : [{ count: 0 }];

  return {
    activeJobs: activeJobs[0].count,
    applications: totalApplications[0].count,
    interviews: interviews[0].count,
    hired: hired[0].count,
  };
});
