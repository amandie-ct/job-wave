import { inngest } from "@/lib/inngest";
import { db } from "@/lib/db";
import { analyzeResume, tailorResume, generateCoverLetter } from "@/lib/services/ats";
import type { ParsedResume } from "@/types";

export const runCampaign = inngest.createFunction(
  { id: "run-campaign", retries: 3 },
  { event: "campaign/run" },
  async ({ event, step }) => {
    const { campaignId, userId } = event.data as {
      campaignId: string;
      userId: string;
    };

    const campaign = await step.run("fetch-campaign", async () => {
      return db.campaign.findFirst({
        where: { id: campaignId, userId },
        include: { jobProfile: true },
      });
    });

    if (!campaign) throw new Error("Campaign not found");

    await step.run("mark-running", async () => {
      return db.campaign.update({
        where: { id: campaignId },
        data: { status: "running", startedAt: new Date() },
      });
    });

    // Fetch the user's default resume
    const resume = await step.run("fetch-resume", async () => {
      return db.resume.findFirst({
        where: { userId, isDefault: true },
      });
    });

    if (!resume?.parsed) {
      await db.campaign.update({
        where: { id: campaignId },
        data: { status: "failed" },
      });
      throw new Error("No parsed default resume found");
    }

    // Fetch candidate jobs from the database
    const jobs = await step.run("fetch-jobs", async () => {
      return db.job.findMany({
        where: {
          NOT: {
            applications: { some: { userId } },
          },
        },
        take: campaign.maxApplications,
      });
    });

    let appliedCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    for (const job of jobs) {
      await step.run(`process-job-${job.id}`, async () => {
        try {
          const parsedResume = resume.parsed as unknown as ParsedResume;
          const analysis = await analyzeResume(parsedResume, job.description);

          if (analysis.score < campaign.atsThreshold) {
            skippedCount++;
            await db.application.create({
              data: {
                userId,
                jobId: job.id,
                resumeId: resume.id,
                campaignId,
                atsScore: analysis.score,
                status: "skipped",
              },
            });
            return;
          }

          const tailored = await tailorResume(parsedResume, job.description);
          const coverLetter = await generateCoverLetter(
            parsedResume,
            job.description,
            job.company
          );

          // TODO: Phase 4/5 — actual application submission via API or Playwright
          await db.application.create({
            data: {
              userId,
              jobId: job.id,
              resumeId: resume.id,
              campaignId,
              atsScore: analysis.score,
              status: "manual", // Manual until automation is built
              coverLetter,
              tailoredData: JSON.parse(JSON.stringify(tailored)),
            },
          });

          appliedCount++;
        } catch {
          failedCount++;
        }
      });
    }

    await step.run("finalize-campaign", async () => {
      return db.campaign.update({
        where: { id: campaignId },
        data: {
          status: "completed",
          completedAt: new Date(),
          appliedCount,
          failedCount,
          skippedCount,
        },
      });
    });

    return { appliedCount, failedCount, skippedCount };
  }
);
