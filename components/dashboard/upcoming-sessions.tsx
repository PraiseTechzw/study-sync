"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"

interface UpcomingSessionsProps {
  userId: Id<"users">
}

export default function UpcomingSessions({ userId }: UpcomingSessionsProps) {
  const sessions = useQuery(api.sessions.getUpcomingByUser, { userId })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Upcoming Sessions</CardTitle>
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {!sessions?.length ? (
          <p className="text-sm text-muted-foreground">
            No upcoming sessions. Join a study group to get started!
          </p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="flex items-center space-x-4 rounded-md border p-4"
              >
                <div>
                  <p className="text-sm font-medium leading-none">
                    {session.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(session.startTime).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

