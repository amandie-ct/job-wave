import { Suspense } from "react";
import { ResumeList } from "@/components/resume/resume-list";
import { ResumeUpload } from "@/components/resume/resume-upload";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResumePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Resumes</h1>
        <ResumeUpload />
      </div>

      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <ResumeList />
      </Suspense>
    </div>
  );
}
