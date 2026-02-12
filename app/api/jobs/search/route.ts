import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { searchJobs } from "@/lib/services/jobs";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const location = searchParams.get("location") ?? undefined;
  const remote = searchParams.get("remote") === "true";
  const page = parseInt(searchParams.get("page") ?? "1");

  if (!query) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  try {
    const jobs = await searchJobs({ query, location, remote, page });
    return NextResponse.json({ data: jobs });
  } catch {
    return NextResponse.json(
      { error: "Job search failed" },
      { status: 500 }
    );
  }
}
