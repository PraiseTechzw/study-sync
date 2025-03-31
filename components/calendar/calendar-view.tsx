"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns"
import Link from "next/link"

interface CalendarViewProps {
  userId: string
}

export function CalendarView({ userId }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const userProfile = useQuery(api.users.getByClerkId, { clerkId: userId })
  const sessions = useQuery(api.sessions.getForUser, userProfile ? { userId: userProfile._id } : "skip")

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const getSessionsForDay = (day: Date) => {
    if (!sessions) return []

    return sessions.filter((session) => {
      const sessionDate = new Date(session.date)
      return isSameDay(sessionDate, day)
    })
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2 text-sm font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-start-${i}`} className="h-24 p-1 border rounded-md bg-muted/20" />
            ))}

            {monthDays.map((day) => {
              const dayNumber = day.getDate()
              const isToday = isSameDay(day, new Date())
              const daySessions = getSessionsForDay(day)

              return (
                <div
                  key={day.toISOString()}
                  className={`h-24 p-1 border rounded-md overflow-hidden ${
                    isToday ? "border-primary bg-primary/5" : "hover:bg-muted/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>{dayNumber}</span>
                    {isToday && (
                      <Badge variant="outline" className="text-xs">
                        Today
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-[calc(100%-24px)]">
                    {sessions ? (
                      daySessions.map((session) => (
                        <Link
                          key={session._id}
                          href={`/groups/${session.groupId}`}
                          className="block text-xs p-1 rounded bg-primary/10 hover:bg-primary/20 truncate"
                        >
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {session.startTime}
                          </div>
                          <div className="truncate">{session.topic}</div>
                        </Link>
                      ))
                    ) : (
                      <Skeleton className="h-8 w-full" />
                    )}
                  </div>
                </div>
              )
            })}

            {Array.from({ length: 6 - monthEnd.getDay() }).map((_, i) => (
              <div key={`empty-end-${i}`} className="h-24 p-1 border rounded-md bg-muted/20" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

