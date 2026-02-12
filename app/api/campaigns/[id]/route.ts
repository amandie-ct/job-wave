import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCampaignById, updateCampaignStatus } from "@/lib/services/campaigns";
import { inngest } from "@/lib/inngest";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const campaign = await getCampaignById(id, session.user.id);

  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: campaign });
}

export async function PATCH(
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
    const { action } = body as { action: string };

    if (action === "run") {
      await updateCampaignStatus(id, session.user.id, "running");

      await inngest.send({
        name: "campaign/run",
        data: { campaignId: id, userId: session.user.id },
      });

      return NextResponse.json({ success: true, message: "Campaign started" });
    }

    if (action === "pause") {
      await updateCampaignStatus(id, session.user.id, "paused");
      return NextResponse.json({ success: true, message: "Campaign paused" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}
