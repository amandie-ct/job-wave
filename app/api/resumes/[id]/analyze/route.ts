import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getResumeById } from "@/lib/services/resume";
import { analyzeResume } from "@/lib/services/ats";
import { atsAnalyzeSchema } from "@/lib/validations";
import type { ParsedResume } from "@/types";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const parsed = atsAnalyzeSchema.safeParse({ resumeId: id, ...body });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const resume = await getResumeById(id, session.user.id);
    if (!resume?.parsed) {
      return NextResponse.json(
        { error: "Resume not found or not parsed" },
        { status: 404 }
      );
    }

    const analysis = await analyzeResume(
      resume.parsed as unknown as ParsedResume,
      parsed.data.jobDescription
    );

    return NextResponse.json({ data: analysis });
  } catch {
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
