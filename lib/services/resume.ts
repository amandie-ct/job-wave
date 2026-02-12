import { db } from "@/lib/db";
import { getOpenAI } from "@/lib/openai";
import { getSupabase, RESUME_BUCKET } from "@/lib/supabase";
import type { ParsedResume } from "@/types";

export async function uploadResume(
  userId: string,
  file: File,
  name: string
) {
  const fileName = `${userId}/${Date.now()}-${file.name}`;

  const { error } = await getSupabase().storage
    .from(RESUME_BUCKET)
    .upload(fileName, file);

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: urlData } = getSupabase().storage
    .from(RESUME_BUCKET)
    .getPublicUrl(fileName);

  const resume = await db.resume.create({
    data: {
      userId,
      name,
      fileUrl: urlData.publicUrl,
      fileName: file.name,
      fileType: file.type,
    },
  });

  return resume;
}

export async function parseResumeWithAI(text: string): Promise<ParsedResume> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a resume parser. Extract structured data from the resume text.
Return a JSON object with: name, email, phone, summary, skills (array),
experience (array of {title, company, location, startDate, endDate, description, highlights}),
education (array of {degree, field, institution, graduationDate, gpa}),
certifications (array), links (array).`,
      },
      { role: "user", content: text },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content!) as ParsedResume;
}

export async function getUserResumes(userId: string) {
  return db.resume.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getResumeById(id: string, userId: string) {
  return db.resume.findFirst({
    where: { id, userId },
  });
}

export async function deleteResume(id: string, userId: string) {
  const resume = await db.resume.findFirst({ where: { id, userId } });
  if (!resume) throw new Error("Resume not found");

  if (resume.fileUrl) {
    const path = resume.fileUrl.split(`${RESUME_BUCKET}/`)[1];
    if (path) {
      await getSupabase().storage.from(RESUME_BUCKET).remove([path]);
    }
  }

  return db.resume.delete({ where: { id } });
}
