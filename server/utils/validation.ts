import { z } from "zod";

export const applySchema = z.object({
  orgId: z.string().min(1),
  jobId: z.string().min(1),
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional(),
  resumeUrl: z.string().url().optional().or(z.literal("")),
  coverLetter: z.string().max(5000).optional(),
  source: z.enum(["direct", "linkedin", "referral", "job_board", "other"]).default("direct"),
});

export const createJobSchema = z.object({
  orgId: z.string().min(1),
  title: z.string().min(1).max(200),
  department: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  type: z.enum(["full-time", "part-time", "contract", "internship"]).optional(),
  description: z.string().max(10000).optional(),
  requirements: z.string().max(5000).optional(),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  userId: z.string().optional(),
});

export const updateJobSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  department: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  type: z.enum(["full-time", "part-time", "contract", "internship"]).optional(),
  description: z.string().max(10000).optional(),
  requirements: z.string().max(5000).optional(),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  status: z.enum(["draft", "published", "closed", "paused"]).optional(),
});

export const pipelineMoveSchema = z.object({
  entryId: z.string().min(1),
  newStageId: z.string().min(1),
  orgId: z.string().min(1),
});

export const updateOrgSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/).optional(),
});

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
    throw createError({ statusCode: 400, message: `Validation failed: ${errors}` });
  }
  return result.data;
}
