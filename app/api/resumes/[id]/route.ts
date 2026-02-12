import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getResumeById, deleteResume } from "@/lib/services/resume";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const resume = await getResumeById(id, session.user.id);

  if (!resume) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: resume });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const resume = await getResumeById(id, session.user.id);
  if (!resume) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await db.resume.update({
    where: { id },
    data: {
      name: body.name ?? resume.name,
      parsed: body.parsed ?? resume.parsed,
      isDefault: body.isDefault ?? resume.isDefault,
    },
  });

  return NextResponse.json({ data: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteResume(id, session.user.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
