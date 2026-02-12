"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPERIENCE_LEVELS, WORK_MODES } from "@/lib/constants";
import { toast } from "sonner";

interface JobProfile {
  id: string;
  name: string;
  targetTitles: string[];
  locations: string[];
  workMode: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  experienceLevel: string | null;
  blacklistedCompanies: string[];
}

export function JobProfileSettings() {
  const [profiles, setProfiles] = useState<JobProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/job-profiles")
      .then((r) => r.json())
      .then(({ data }) => setProfiles(data ?? []));
  }, []);

  async function createProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      targetTitles: (form.get("targetTitles") as string).split(",").map((s) => s.trim()).filter(Boolean),
      locations: (form.get("locations") as string).split(",").map((s) => s.trim()).filter(Boolean),
      workMode: form.get("workMode") as string || undefined,
      experienceLevel: form.get("experienceLevel") as string || undefined,
    };

    const res = await fetch("/api/job-profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const { data: profile } = await res.json();
      setProfiles((prev) => [profile, ...prev]);
      toast.success("Profile created");
      e.currentTarget.reset();
    } else {
      toast.error("Failed to create profile");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Job Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Profile Name</Label>
              <Input id="name" name="name" placeholder="e.g. Frontend Roles" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetTitles">Target Titles (comma-separated)</Label>
              <Input
                id="targetTitles"
                name="targetTitles"
                placeholder="Frontend Engineer, React Developer"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locations">Locations (comma-separated)</Label>
              <Input
                id="locations"
                name="locations"
                placeholder="Remote, New York, San Francisco"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Work Mode</Label>
                <Select name="workMode">
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_MODES.map((mode) => (
                      <SelectItem key={mode.value} value={mode.value}>
                        {mode.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select name="experienceLevel">
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {profiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Profiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profiles.map((profile) => (
              <div key={profile.id} className="rounded-md border p-4">
                <p className="font-medium">{profile.name}</p>
                <p className="text-sm text-muted-foreground">
                  Titles: {profile.targetTitles.join(", ")}
                </p>
                {profile.locations.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Locations: {profile.locations.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
