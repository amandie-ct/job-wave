import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export async function RecentActivity() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const recentApps = await db.application.findMany({
    where: { userId: session.user.id },
    include: { job: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {recentApps.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No applications yet. Start by uploading a resume and searching for jobs.
          </p>
        ) : (
          <div className="space-y-3">
            {recentApps.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="font-medium">{app.job.title}</p>
                  <p className="text-sm text-muted-foreground">{app.job.company}</p>
                </div>
                <div className="flex items-center gap-2">
                  {app.atsScore != null && (
                    <span className="text-sm text-muted-foreground">
                      {app.atsScore}%
                    </span>
                  )}
                  <Badge variant={app.status === "applied" ? "default" : "secondary"}>
                    {app.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
