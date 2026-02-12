import { getOpenAI } from "@/lib/openai";
import type { ATSAnalysis, ParsedResume } from "@/types";

export async function analyzeResume(
  resume: ParsedResume,
  jobDescription: string
): Promise<ATSAnalysis> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an ATS (Applicant Tracking System) analyzer. Compare a candidate's resume against a job description and provide a detailed analysis.

Scoring weights:
- Skills match: 40%
- Experience relevance: 35%
- Education fit: 15%
- Overall presentation: 10%

Return a JSON object with:
- score: number 0-100 (overall match score)
- missingKeywords: string[] (skills/terms in JD but not in resume)
- presentKeywords: string[] (matching skills/terms found)
- suggestions: string[] (specific improvements to increase match)
- tailoredSummary: string (a rewritten professional summary tailored to this role)
- sectionScores: { skills: number, experience: number, education: number, overall: number } (each 0-100)`,
      },
      {
        role: "user",
        content: `RESUME:\n${JSON.stringify(resume)}\n\nJOB DESCRIPTION:\n${jobDescription}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content!) as ATSAnalysis;
}

export async function generateCoverLetter(
  resume: ParsedResume,
  jobDescription: string,
  companyName: string
): Promise<string> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Write a professional, concise cover letter. Keep it under 300 words.
Match the candidate's experience to the job requirements. Be specific about why they're a good fit.
Do not use generic filler. Sound human and genuine.`,
      },
      {
        role: "user",
        content: `RESUME:\n${JSON.stringify(resume)}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nCOMPANY: ${companyName}`,
      },
    ],
  });

  return response.choices[0].message.content!;
}

export async function tailorResume(
  resume: ParsedResume,
  jobDescription: string
): Promise<ParsedResume> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a resume tailoring expert. Given a resume and job description,
rewrite the resume to better match the job. Adjust the summary, reorder skills to prioritize
relevant ones, and enhance experience descriptions with relevant keywords.
Do NOT fabricate experience or skills. Only reframe existing content.
Return the result as a JSON object matching the original resume structure.`,
      },
      {
        role: "user",
        content: `RESUME:\n${JSON.stringify(resume)}\n\nJOB DESCRIPTION:\n${jobDescription}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content!) as ParsedResume;
}
