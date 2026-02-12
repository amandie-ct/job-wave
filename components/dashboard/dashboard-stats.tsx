import { auth } from "@/lib/auth";
import { getDashboardStats } from "@/lib/services/campaigns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Send, Rocket, BarChart3 } from "lucide-react";

export async function DashboardStats() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const stats = await getDashboardStats(session.user.id);

  const items = [
    { label: "Resumes", value: stats.resumeCount, icon: FileText },
    { label: "Applications", value: stats.totalApplications, icon: Send },
    { label: "Applied", value: stats.appliedCount, icon: BarChart3 },
    { label: "Campaigns", value: stats.campaignCount, icon: Rocket },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
