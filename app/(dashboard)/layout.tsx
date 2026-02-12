import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SessionProvider } from "@/components/providers/session-provider";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <SessionProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader user={session.user} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
