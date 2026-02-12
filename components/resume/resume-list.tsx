import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserResumes } from "@/lib/services/resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ScanSearch } from "lucide-react";

export async function ResumeList() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const resumes = await getUserResumes(session.user.id);

  if (resumes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">No resumes yet</p>
          <p className="text-sm text-muted-foreground">
            Upload your first resume to get started with ATS analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {resumes.map((resume) => (
        <Card key={resume.id}>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-base">{resume.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {resume.fileName}
              </p>
            </div>
            {resume.isDefault && <Badge>Default</Badge>}
          </CardHeader>
          <CardContent className="flex gap-2">
            <Link href={`/resume/${resume.id}/analyze`}>
              <Button size="sm" variant="outline">
                <ScanSearch className="mr-1 h-3 w-3" />
                Analyze
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
