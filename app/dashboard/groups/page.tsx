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
  const userGroups = profile ? useQuery(api.groups.getForUser, { userId: profile._id }) : null
  const recommendedGroups = profile ? useQuery(api.groups.getRecommended, { userId: profile._id, limit: 3 }) : null

  const isLoading = !isLoaded || (user?.id && !profile)

  return (
    <DashboardShell>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : !profile ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <p className="text-muted-foreground">Please complete your onboarding.</p>
          <Link href="/onboarding" className="text-primary hover:underline mt-4">
            Complete Onboarding
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Study Groups</h1>
              <p className="text-muted-foreground">Join or create study groups for your courses</p>
            </div>
            <Link href="/dashboard/groups/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </Link>
          </div>

          <div className="grid gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Groups</h2>
              <div className="grid gap-4">
                {!userGroups ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : userGroups.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium text-lg mb-1">No groups yet</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't joined any study groups yet.
                      </p>
                      <Button asChild>
                        <Link href="/dashboard/groups/create">Create a Group</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  userGroups.map((group) => (
                    <Link key={group._id} href={`/dashboard/groups/${group._id}`}>
                      <Card className="transition-colors hover:bg-accent">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            {group.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {group.course} • {group.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Recommended Groups</h2>
              <div className="grid gap-4">
                {!recommendedGroups ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : recommendedGroups.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      No recommended groups at the moment.
                    </CardContent>
                  </Card>
                ) : (
                  recommendedGroups.map((group) => (
                    <Link key={group._id} href={`/dashboard/groups/${group._id}`}>
                      <Card className="transition-colors hover:bg-accent">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            {group.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {group.course} • {group.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}

