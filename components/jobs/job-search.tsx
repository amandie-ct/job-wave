"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { JobSearchResult } from "@/types";
import { Search } from "lucide-react";

export function JobSearch() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState<JobSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const params = new URLSearchParams({ q: query });
    if (location) params.set("location", location);

    const res = await fetch(`/api/jobs/search?${params}`);
    if (!res.ok) {
      toast.error("Search failed");
      setLoading(false);
      return;
    }

    const { data } = await res.json();
    setResults(data);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={onSearch} className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 space-y-1">
              <Label htmlFor="query">Job Title / Keywords</Label>
              <Input
                id="query"
                placeholder="e.g. React Developer"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. Remote, New York"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={loading}>
                <Search className="mr-2 h-4 w-4" />
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {results.map((job) => (
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
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {job.description}
              </p>
              {job.salary && (
                <p className="mt-2 text-sm font-medium">{job.salary}</p>
              )}
              {job.applyUrl && (
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-primary underline"
                >
                  Apply externally
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
