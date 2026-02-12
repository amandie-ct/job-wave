import { Suspense } from "react";
import { CampaignList } from "@/components/campaigns/campaign-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Campaigns</h1>
      </div>

      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <CampaignList />
      </Suspense>
    </div>
  );
}
