// ──────────────────────────────────────
// Resume types
// ──────────────────────────────────────

export interface ParsedResume {
  name: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  certifications?: string[];
  links?: string[];
}

export interface WorkExperience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  highlights?: string[];
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  graduationDate?: string;
  gpa?: string;
}

// ──────────────────────────────────────
// ATS Analysis types
// ──────────────────────────────────────

export interface ATSAnalysis {
  score: number; // 0-100
  missingKeywords: string[];
  presentKeywords: string[];
  suggestions: string[];
  tailoredSummary: string;
  sectionScores: {
    skills: number;
    experience: number;
    education: number;
    overall: number;
  };
}

// ──────────────────────────────────────
// Job types
// ──────────────────────────────────────

export interface JobSearchParams {
  query: string;
  location?: string;
  remote?: boolean;
  page?: number;
  limit?: number;
}

export interface JobSearchResult {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  source: string;
  applyUrl: string;
  postedAt?: string;
}

// ──────────────────────────────────────
// Campaign types
// ──────────────────────────────────────

export type CampaignStatus = "draft" | "running" | "paused" | "completed" | "failed";

export type ApplicationStatus = "pending" | "applied" | "failed" | "manual" | "skipped";

export interface CampaignSettings {
  jobProfileId: string;
  atsThreshold: number;
  maxApplications: number;
  resumeId?: string;
  autoTailor: boolean;
}

// ──────────────────────────────────────
// API response types
// ──────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
