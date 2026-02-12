"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface CampaignData {
  id: string;
  name: string;
  status: string;
  atsThreshold: number;
  appliedCount: number;
  failedCount: number;
  skippedCount: number;
  jobProfile: { name: string };
  applications: {
    id: string;
    status: string;
    atsScore: number | null;
    job: { title: string; company: string };
  }[];
}

export function CampaignDetail({ campaignId }: { campaignId: string }) {
  const [campaign, setCampaign] = useState<CampaignData | null>(null);

  useEffect(() => {
    fetch(`/api/campaigns/${campaignId}`)
      .then((r) => r.json())
      .then(({ data }) => setCampaign(data));
  }, [campaignId]);

  async function runCampaign() {
    const res = await fetch(`/api/campaigns/${campaignId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "run" }),
    });

    if (res.ok) {
      toast.success("Campaign started");
    } else {
      toast.error("Failed to start campaign");
    }
  }

  if (!campaign) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{campaign.name}</h1>
          <p className="text-muted-foreground">
            Profile: {campaign.jobProfile.name} &middot; Threshold: {campaign.atsThreshold}%
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge>{campaign.status}</Badge>
          {campaign.status === "draft" && (
            <Button onClick={runCampaign}>Run Campaign</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Applied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{campaign.appliedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{campaign.failedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Skipped</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{campaign.skippedCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>ATS Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaign.applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.job.title}</TableCell>
                  <TableCell>{app.job.company}</TableCell>
                  <TableCell>{app.atsScore ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={app.status === "applied" ? "default" : "secondary"}>
                      {app.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
