import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { jobProfileSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profiles = await db.jobProfile.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: profiles });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = jobProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const profile = await db.jobProfile.create({
      data: {
        userId: session.user.id,
        ...parsed.data,
      },
    });

    return NextResponse.json({ data: profile }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create job profile" },
      { status: 500 }
    );
  }
}
