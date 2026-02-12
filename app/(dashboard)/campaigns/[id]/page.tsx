import { Suspense } from "react";
import { CampaignDetail } from "@/components/campaigns/campaign-detail";
import { Skeleton } from "@/components/ui/skeleton";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <CampaignDetail campaignId={id} />
      </Suspense>
    </div>
  );
}
