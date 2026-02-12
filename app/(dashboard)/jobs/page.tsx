import { Suspense } from "react";
import { JobList } from "@/components/jobs/job-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Matched Jobs</h1>

      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <JobList />
      </Suspense>
    </div>
  );
}
