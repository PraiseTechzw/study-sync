"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import DashboardShell from "@/components/dashboard/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Plus, Loader2 } from "lucide-react"
import Link from "next/link"

export default function GroupsPage() {
  const { user, isLoaded } = useUser()
  const profile = useQuery(api.users.getByClerkId, { clerkId: user?.id || "" })
  const userGroups = useQuery(api.groups.getForUser, { 
    userId: profile?._id || "skip"
  })
  const recommendedGroups = useQuery(api.groups.getRecommended, { 
    userId: profile?._id || "skip",
    limit: 3
  })

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
          <Link href="/onboarding" className="text-primary hover:underline mt-4">
            Complete Onboarding
          </Link>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Study Groups</h1>
            <p className="text-muted-foreground">
              Join or create study groups for your courses
            </p>
          </div>
          <Link href="/dashboard/groups/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Groups</CardTitle>
            </CardHeader>
            <CardContent>
              {userGroups?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  You haven't joined any groups yet
                </div>
              ) : (
                <div className="space-y-4">
                  {userGroups?.map((group) => (
                    <div
                      key={group._id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <h3 className="font-medium">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {group.course}
                        </p>
                      </div>
                      <Link href={`/dashboard/groups/${group._id}`}>
                        <Button variant="outline" size="sm">
                          View Group
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Groups</CardTitle>
            </CardHeader>
            <CardContent>
              {recommendedGroups?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No recommended groups available
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendedGroups?.map((group) => (
                    <div
                      key={group._id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <h3 className="font-medium">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {group.course}
                        </p>
                      </div>
                      <Link href={`/dashboard/groups/${group._id}`}>
                        <Button variant="outline" size="sm">
                          View Group
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}

