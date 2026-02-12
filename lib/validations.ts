import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const resumeUploadSchema = z.object({
  name: z.string().min(1, "Resume name is required"),
  file: z.any(),
});

export const jobProfileSchema = z.object({
  name: z.string().min(1, "Profile name is required"),
  targetTitles: z.array(z.string()).min(1, "At least one job title is required"),
  locations: z.array(z.string()).optional().default([]),
  workMode: z.enum(["remote", "hybrid", "onsite"]).optional(),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  experienceLevel: z.enum(["entry", "mid", "senior", "lead"]).optional(),
  blacklistedCompanies: z.array(z.string()).optional().default([]),
});

export const atsAnalyzeSchema = z.object({
  resumeId: z.string().min(1, "Resume is required"),
  jobDescription: z.string().min(50, "Job description must be at least 50 characters"),
});

export const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  jobProfileId: z.string().min(1, "Job profile is required"),
  atsThreshold: z.number().min(0).max(100).default(60),
  maxApplications: z.number().min(1).max(500).default(50),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type JobProfileInput = z.infer<typeof jobProfileSchema>;
export type ATSAnalyzeInput = z.infer<typeof atsAnalyzeSchema>;
export type CampaignInput = z.infer<typeof campaignSchema>;
