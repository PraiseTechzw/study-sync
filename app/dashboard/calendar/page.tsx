"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import DashboardShell from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { format, startOfMonth, endOfMonth, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function CalendarPage() {
  const { user, isLoaded } = useUser()
  const profile = useQuery(api.users.getByClerkId, { clerkId: user?.id || "" })
  const sessions = useQuery(api.sessions.getForUser, { 
    userId: profile?._id || "skip"
  })

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [view, setView] = useState<"month" | "week">("month")

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

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const getSessionsForDay = (date: Date) => {
    if (!sessions) return []
    return sessions.filter(session => isSameDay(new Date(session.date), date))
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground">
              View and manage your study sessions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
            <CardDescription>
              {sessions?.length || 0} sessions this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={currentMonth}
              onSelect={(date) => date && setCurrentMonth(date)}
              className="rounded-md border"
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              renderDay={(date) => {
                const daySessions = getSessionsForDay(date)
                return (
                  <div className="relative">
                    <div className="absolute -top-1 -right-1">
                      {daySessions.length > 0 && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    {format(date, "d")}
                  </div>
                )
              }}
            />
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          <motion.div
            key={format(currentMonth, "yyyy-MM")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>
                  Sessions for {format(currentMonth, "MMMM yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessions?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No sessions scheduled for this month
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions?.map((session) => (
                      <div
                        key={session._id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="space-y-1">
                          <h3 className="font-medium">{session.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(session.date), "PPP")} at{" "}
                            {session.startTime} - {session.endTime}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardShell>
  )
}

