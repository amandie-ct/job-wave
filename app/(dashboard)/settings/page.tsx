import { Suspense } from "react";
import { JobProfileSettings } from "@/components/settings/job-profile-settings";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <JobProfileSettings />
      </Suspense>
    </div>
  );
}
