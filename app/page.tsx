import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
          <img src="/logo.png" alt="JobWave Logo" className="h-12 w-auto" />
          <h1 className="text-3xl font-bold font-[family-name:var(--font-berkshire-swash)] text-mainBlue">JobWave</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-mainBlue hover:bg-mainBlue/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-5xl font-bold tracking-tight font-sans">
            Land your next role, <span className="text-primary">faster</span>
          </h2>
          <p className="text-xl text-muted-foreground font-sans">
            Upload your resume, get AI-powered ATS analysis, search thousands of
            jobs, and mass-apply with tailored applications — all from one
            platform.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/register">
            <Button size="lg" className="bg-mainBlue hover:bg-mainBlue/90">Start Free</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="border-mainBlue text-mainBlue hover:bg-mainBlue/10">
              Sign In
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
