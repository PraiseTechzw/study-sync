import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CalendarView } from "@/components/calendar/calendar-view"

export default async function CalendarPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Study Calendar" text="View and manage your upcoming study sessions." />

      <CalendarView userId={user.id} />
    </DashboardShell>
  )
}

