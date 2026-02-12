import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserResumes, uploadResume, parseResumeWithAI } from "@/lib/services/resume";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resumes = await getUserResumes(session.user.id);
  return NextResponse.json({ data: resumes });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string;

    if (!file || !name) {
      return NextResponse.json(
        { error: "File and name are required" },
        { status: 400 }
      );
    }

    const resume = await uploadResume(session.user.id, file, name);

    // Trigger async parsing — for now do it inline
    // In production, offload to a queue
    const text = await file.text();
    const parsed = await parseResumeWithAI(text);

    const updated = await db.resume.update({
      where: { id: resume.id },
      data: { parsed: JSON.parse(JSON.stringify(parsed)) },
    });

    return NextResponse.json({ data: updated }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: 500 }
    );
  }
}
