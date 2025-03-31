"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Users } from "lucide-react"
import Link from "next/link"

export function RecommendedGroups() {
  const { user } = useUser()
  const userId = user?.id

  const userProfile = useQuery(api.users.getByClerkId, userId ? { clerkId: userId } : "skip")
  const recommendedGroups = useQuery(
    api.groups.getRecommended,
    userProfile ? { userId: userProfile._id, limit: 3 } : "skip",
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recommended Groups</CardTitle>
            <CardDescription>Study groups you might be interested in joining.</CardDescription>
          </div>
          <Link href="/groups?tab=discover">
            <Button variant="outline" size="sm">
              Discover More
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendedGroups ? (
            recommendedGroups.length > 0 ? (
              recommendedGroups.map((group) => (
                <div
                  key={group._id}
                  className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div className="grid gap-1 flex-1">
                    <h3 className="font-semibold">{group.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> {group.members.length} members
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/groups/${group._id}`}>View</Link>
                      </Button>
                      <Button size="sm">Join</Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-1">No recommendations yet</h3>
                <p className="text-muted-foreground mb-4">
                  We'll recommend groups based on your courses and interests.
                </p>
                <Link href="/groups?tab=discover">
                  <Button>Browse All Groups</Button>
                </Link>
              </div>
            )
          ) : (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-start">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-full max-w-[200px]" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 w-24 rounded-md" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

