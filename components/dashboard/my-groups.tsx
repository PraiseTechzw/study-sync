"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, MessageSquare, Users } from "lucide-react"
import Link from "next/link"

export function MyGroups() {
  const { user } = useUser()
  const userId = user?.id

  const groups = useQuery(api.groups.getForUser, userId ? { userId } : "skip")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Study Groups</CardTitle>
            <CardDescription>Groups you've joined or created.</CardDescription>
          </div>
          <Link href="/groups">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {groups ? (
            groups.length > 0 ? (
              groups.slice(0, 3).map((group) => (
                <div
                  key={group._id}
                  className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div className="grid gap-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{group.name}</h3>
                      {group.unreadMessages > 0 && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" /> {group.unreadMessages}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> {group.members.length} members
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Link href={`/groups/${group._id}`}>
                        <Button size="sm">View Group</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-1">No study groups yet</h3>
                <p className="text-muted-foreground mb-4">You haven't joined any study groups yet.</p>
                <Link href="/groups/create">
                  <Button>Create a Group</Button>
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

