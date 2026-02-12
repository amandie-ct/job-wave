"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import type { ATSAnalysis } from "@/types";

interface ATSAnalyzerProps {
  resumeId: string;
}

export function ATSAnalyzer({ resumeId }: ATSAnalyzerProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  async function onAnalyze() {
    if (jobDescription.length < 50) {
      toast.error("Job description must be at least 50 characters");
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/resumes/${resumeId}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription }),
    });

    if (!res.ok) {
      toast.error("Analysis failed");
      setLoading(false);
      return;
    }

    const { data } = await res.json();
    setAnalysis(data);
    setLoading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste the full job description here..."
              rows={12}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <Button onClick={onAnalyze} disabled={loading} className="w-full">
              {loading ? "Analyzing..." : "Analyze Match"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {analysis && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Match Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <span className="text-5xl font-bold">{analysis.score}</span>
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <Progress value={analysis.score} />
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <p className="text-muted-foreground">Skills</p>
                    <p className="font-medium">{analysis.sectionScores.skills}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Experience</p>
                    <p className="font-medium">{analysis.sectionScores.experience}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Education</p>
                    <p className="font-medium">{analysis.sectionScores.education}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Missing Keywords</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {analysis.missingKeywords.map((kw) => (
                  <Badge key={kw} variant="destructive">{kw}</Badge>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-1 pl-4 text-sm">
                  {analysis.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tailored Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{analysis.tailoredSummary}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
