"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import Link from "next/link"

interface UpcomingSessionsProps {
  className?: string
}

export function UpcomingSessions({ className }: UpcomingSessionsProps) {
  const { user } = useUser()
  const userId = user?.id

  const sessions = useQuery(api.sessions.getUpcoming, userId ? { userId } : "skip")

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split("T")[0]
    return dateString === today
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (dateString === today.toISOString().split("T")[0]) {
      return "Today"
    } else if (dateString === tomorrow.toISOString().split("T")[0]) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled study sessions for the next 7 days.</CardDescription>
          </div>
          <Link href="/calendar">
            <Button variant="outline" size="sm">
              View Calendar
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions ? (
            sessions.length > 0 ? (
              sessions.map((session) => (
                <div
                  key={session._id}
                  className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="grid gap-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{session.topic}</h3>
                      {isToday(session.date) && <Badge>Today</Badge>}
                    </div>
                    <div className="grid gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {formatDate(session.date)}, {session.startTime} -{" "}
                        {session.endTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {session.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" /> {session.attendees.length} attendees
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Link href={`/groups/${session.groupId}`}>
                        <Button size="sm" variant="outline">
                          View Group
                        </Button>
                      </Link>
                      {isToday(session.date) && <Button size="sm">Join Session</Button>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-1">No upcoming sessions</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any study sessions scheduled for the next 7 days.
                </p>
                <Button>Schedule a Session</Button>
              </div>
            )
          ) : (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-start">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-full max-w-[200px]" />
                  <Skeleton className="h-4 w-full" />
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

