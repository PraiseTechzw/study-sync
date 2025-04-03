"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import DashboardShell from "@/components/dashboard/shell"
import WelcomeBanner from "@/components/dashboard/welcome-banner"
import UpcomingSessions from "@/components/dashboard/upcoming-sessions"
import YourGroups from "@/components/dashboard/your-groups"

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const profile = useQuery(api.users.getProfile, user?.id ? { userId: user.id } : "skip")

  if (!isLoaded) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardShell>
    )
  }

  if (!profile) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <p className="text-muted-foreground">Please complete your onboarding.</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        <WelcomeBanner />
        <div className="grid gap-4 md:grid-cols-2">
          <UpcomingSessions userId={profile._id} />
          <YourGroups userId={profile._id} />
        </div>
      </div>
    </DashboardShell>
  )
}

