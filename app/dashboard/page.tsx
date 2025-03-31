import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Overview } from "@/components/dashboard/overview"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingSessions } from "@/components/dashboard/upcoming-sessions"
import { MyGroups } from "@/components/dashboard/my-groups"
import { RecommendedGroups } from "@/components/dashboard/recommended-groups"

export default async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Welcome back! Here's an overview of your study activities." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Overview className="col-span-4" />
        <RecentActivity className="col-span-3" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <UpcomingSessions className="lg:col-span-3" />
        <div className="space-y-6 lg:col-span-4">
          <MyGroups />
          <RecommendedGroups />
        </div>
      </div>
    </DashboardShell>
  )
}

