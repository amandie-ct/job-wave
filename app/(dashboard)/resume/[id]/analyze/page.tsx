import { ATSAnalyzer } from "@/components/resume/ats-analyzer";

export default async function AnalyzePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ATS Analysis</h1>
      <ATSAnalyzer resumeId={id} />
    </div>
  );
}
