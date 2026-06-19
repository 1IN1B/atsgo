import { alibaba } from "@ai-sdk/alibaba";
import { generateText, generateObject } from "ai";
import { z } from "zod";

type QwenModel = "qwen-turbo" | "qwen-plus" | "qwen-max" | "qwen3-max";

const modelMap: Record<string, QwenModel> = {
  fast: "qwen-turbo",
  standard: "qwen-plus",
  advanced: "qwen-max",
  reasoning: "qwen3-max",
};

function getModel(tier: string = "standard") {
  const apiKey = process.env.ALIBABA_API_KEY || useRuntimeConfig().alibabaApiKey;
  const modelId = modelMap[tier] || modelMap.standard;
  return alibaba(modelId, { apiKey });
}

export async function parseResume(resumeText: string) {
  const { object } = await generateObject({
    model: getModel("fast"),
    schema: z.object({
      name: z.string(),
      email: z.string().optional(),
      phone: z.string().optional(),
      skills: z.array(z.string()),
      experience: z.array(z.object({
        title: z.string(),
        company: z.string().optional(),
        duration: z.string().optional(),
        description: z.string().optional(),
      })),
      education: z.array(z.object({
        degree: z.string(),
        institution: z.string().optional(),
        year: z.string().optional(),
      })),
      summary: z.string(),
    }),
    prompt: `Extract structured information from this resume:\n\n${resumeText}`,
  });

  return object;
}

export async function scoreCandidate(candidateProfile: string, jobRequirements: string) {
  const { object } = await generateObject({
    model: getModel("standard"),
    schema: z.object({
      score: z.number().min(0).max(100),
      skillMatch: z.number().min(0).max(100),
      experienceMatch: z.number().min(0).max(100),
      strengths: z.array(z.string()),
      gaps: z.array(z.string()),
      recommendation: z.enum(["strong_match", "potential_match", "weak_match", "no_match"]),
      reasoning: z.string(),
    }),
    prompt: `Score this candidate against the job requirements.

Candidate profile:
${candidateProfile}

Job requirements:
${jobRequirements}`,
  });

  return object;
}

export async function generateJobDescription(brief: string) {
  const { text } = await generateText({
    model: getModel("standard"),
    prompt: `Generate a professional job description based on this brief:
${brief}`,
  });

  return text;
}

export async function draftEmail(context: string, tone: string = "professional") {
  const { text } = await generateText({
    model: getModel("fast"),
    prompt: `Draft a ${tone} email. Context: ${context}`,
  });

  return text;
}

export async function generateInterviewQuestions(jobTitle: string, skills: string[]) {
  const { object } = await generateObject({
    model: getModel("standard"),
    schema: z.object({
      technical: z.array(z.object({
        question: z.string(),
        skill: z.string(),
      })),
      behavioral: z.array(z.object({
        question: z.string(),
        trait: z.string(),
      })),
    }),
    prompt: `Generate interview questions for ${jobTitle} role. Key skills: ${skills.join(", ")}`,
  });

  return object;
}
