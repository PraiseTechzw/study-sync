"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Loader2 } from "lucide-react"
import DashboardShell from "@/components/dashboard/shell"
import { RecommendedGroups } from "@/components/dashboard/recommended-groups"
import { YourGroups } from "@/components/dashboard/your-groups"
import { WelcomeBanner } from "@/components/dashboard/welcome-banner"
import UpcomingSessions from "@/components/dashboard/upcoming-sessions"

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const convexUser = useQuery(api.users.getByClerkId, { 
    clerkId: user?.id || "" 
  })

  if (!isLoaded || !convexUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <WelcomeBanner user={convexUser} />
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <UpcomingSessions userId={convexUser._id} />
            <YourGroups userId={convexUser._id} />
          </div>
          <div>
            <RecommendedGroups userId={convexUser._id} />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

