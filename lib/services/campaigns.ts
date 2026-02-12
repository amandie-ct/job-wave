import { db } from "@/lib/db";
import type { CampaignInput } from "@/lib/validations";

export async function createCampaign(userId: string, input: CampaignInput) {
  return db.campaign.create({
    data: {
      userId,
      name: input.name,
      jobProfileId: input.jobProfileId,
      atsThreshold: input.atsThreshold,
      maxApplications: input.maxApplications,
    },
  });
}

export async function getUserCampaigns(userId: string) {
  return db.campaign.findMany({
    where: { userId },
    include: {
      jobProfile: true,
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCampaignById(id: string, userId: string) {
  return db.campaign.findFirst({
    where: { id, userId },
    include: {
      jobProfile: true,
      applications: {
        include: { job: true, resume: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function updateCampaignStatus(
  id: string,
  userId: string,
  status: string
) {
  return db.campaign.update({
    where: { id },
    data: {
      status,
      ...(status === "running" ? { startedAt: new Date() } : {}),
      ...(status === "completed" || status === "failed"
        ? { completedAt: new Date() }
        : {}),
    },
  });
}

export async function getDashboardStats(userId: string) {
  const [totalApplications, appliedCount, campaignCount, resumeCount] =
    await Promise.all([
      db.application.count({ where: { userId } }),
      db.application.count({ where: { userId, status: "applied" } }),
      db.campaign.count({ where: { userId } }),
      db.resume.count({ where: { userId } }),
    ]);

  return {
    totalApplications,
    appliedCount,
    campaignCount,
    resumeCount,
  };
}
