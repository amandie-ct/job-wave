import { Suspense } from "react";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <DashboardStats />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <RecentActivity />
      </Suspense>
    </div>
  );
}
