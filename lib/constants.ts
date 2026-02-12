export const APP_NAME = "Job Wave";

export const ATS_THRESHOLD_DEFAULT = 60;
export const MAX_APPLICATIONS_DEFAULT = 50;
export const MAX_RESUME_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_RESUME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead / Principal" },
] as const;

export const WORK_MODES = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
] as const;

export const APPLICATION_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "applied", label: "Applied" },
  { value: "failed", label: "Failed" },
  { value: "manual", label: "Manual Required" },
  { value: "skipped", label: "Skipped" },
] as const;

export const CAMPAIGN_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "running", label: "Running" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
] as const;

export const JOB_SOURCES = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "indeed", label: "Indeed" },
  { value: "glassdoor", label: "Glassdoor" },
  { value: "other", label: "Other" },
] as const;
