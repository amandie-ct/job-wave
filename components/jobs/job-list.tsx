import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";

export async function JobList() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const jobs = await db.job.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Briefcase className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">No jobs found</p>
          <p className="text-sm text-muted-foreground">
            Search for jobs to populate your feed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{job.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {job.company} &middot; {job.location}
                </p>
              </div>
              <Badge variant="outline">{job.source}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {job.description}
            </p>
            {job.salary && (
              <p className="mt-2 text-sm font-medium">{job.salary}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
