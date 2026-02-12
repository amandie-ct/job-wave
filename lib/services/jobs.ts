import { db } from "@/lib/db";
import type { JobSearchParams, JobSearchResult } from "@/types";

const RAPIDAPI_HOST = "jsearch.p.rapidapi.com";

export async function searchJobs(
  params: JobSearchParams
): Promise<JobSearchResult[]> {
  const { query, location, remote, page = 1, limit = 10 } = params;

  let searchQuery = query;
  if (location) searchQuery += ` in ${location}`;
  if (remote) searchQuery += " remote";

  const url = new URL("https://jsearch.p.rapidapi.com/search");
  url.searchParams.set("query", searchQuery);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("num_pages", "1");

  const response = await fetch(url.toString(), {
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
      "x-rapidapi-host": RAPIDAPI_HOST,
    },
  });

  if (!response.ok) {
    throw new Error(`Job search failed: ${response.statusText}`);
  }

  const data = await response.json();

  const jobs: JobSearchResult[] = (data.data ?? [])
    .slice(0, limit)
    .map((job: Record<string, unknown>) => ({
      id: job.job_id as string,
      title: job.job_title as string,
      company: job.employer_name as string,
      location: (job.job_city as string) ?? (job.job_country as string) ?? "Remote",
      description: job.job_description as string,
      salary: formatSalary(job),
      source: "jsearch",
      applyUrl: (job.job_apply_link as string) ?? "",
      postedAt: job.job_posted_at_datetime_utc as string | undefined,
    }));

  return jobs;
}

function formatSalary(job: Record<string, unknown>): string | undefined {
  const min = job.job_min_salary as number | null;
  const max = job.job_max_salary as number | null;
  if (!min && !max) return undefined;
  if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  if (min) return `From $${min.toLocaleString()}`;
  return `Up to $${max!.toLocaleString()}`;
}

export async function saveJobToDb(job: JobSearchResult) {
  return db.job.upsert({
    where: { externalId: job.id },
    update: {
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      salary: job.salary,
      applyUrl: job.applyUrl,
    },
    create: {
      externalId: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      salary: job.salary,
      source: job.source,
      applyUrl: job.applyUrl,
      postedAt: job.postedAt ? new Date(job.postedAt) : undefined,
    },
  });
}

export async function getJobById(id: string) {
  return db.job.findUnique({ where: { id } });
}
