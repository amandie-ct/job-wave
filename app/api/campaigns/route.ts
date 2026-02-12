import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCampaign, getUserCampaigns } from "@/lib/services/campaigns";
import { campaignSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const campaigns = await getUserCampaigns(session.user.id);
  return NextResponse.json({ data: campaigns });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = campaignSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const campaign = await createCampaign(session.user.id, parsed.data);
    return NextResponse.json({ data: campaign }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
