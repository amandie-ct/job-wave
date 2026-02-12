import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserCampaigns } from "@/lib/services/campaigns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

export async function CampaignList() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const campaigns = await getUserCampaigns(session.user.id);

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Rocket className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">No campaigns yet</p>
          <p className="text-sm text-muted-foreground">
            Create a campaign to start mass-applying to jobs.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">{campaign.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Profile: {campaign.jobProfile.name}
              </p>
            </div>
            <Badge
              variant={campaign.status === "completed" ? "default" : "secondary"}
            >
              {campaign.status}
            </Badge>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Applied: {campaign.appliedCount}</span>
              <span>Failed: {campaign.failedCount}</span>
              <span>Skipped: {campaign.skippedCount}</span>
            </div>
            <Link href={`/campaigns/${campaign.id}`}>
              <Button size="sm" variant="outline">View Details</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
