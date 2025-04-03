"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import DashboardShell from "@/components/dashboard/shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Loader2, Plus, Users } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export default function CalendarPage() {
  const { user, isLoaded } = useUser()
  const profile = useQuery(api.users.getByClerkId, { clerkId: user?.id || "" })
  const sessions = profile ? useQuery(api.sessions.getForUser, { userId: profile._id }) : null

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [view, setView] = useState<"month" | "week">("month")

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

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
          <div>
            <h1 className="text-3xl font-bold">Study Calendar</h1>
            <p className="text-muted-foreground">Schedule and manage your study sessions</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={view === "month" ? "default" : "outline"}
                onClick={() => setView("month")}
              >
                Month
              </Button>
              <Button
                variant={view === "week" ? "default" : "outline"}
                onClick={() => setView("week")}
              >
                Week
              </Button>
            </div>
            <Link href="/dashboard/calendar/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Session
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {format(currentMonth, "MMMM yyyy")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-medium text-sm text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              {days.map((day) => {
                const daySessions = sessions?.filter((session) => {
                  const sessionDate = parseISO(session.date)
                  return (
                    sessionDate.getDate() === day.getDate() &&
                    sessionDate.getMonth() === day.getMonth() &&
                    sessionDate.getFullYear() === day.getFullYear()
                  )
                })

                return (
                  <motion.div
                    key={day.toString()}
                    className={`
                      min-h-[100px] p-2 border rounded-lg
                      ${isSameMonth(day, currentMonth) ? "bg-background" : "bg-muted/50"}
                      ${isToday(day) ? "border-primary" : "border-border"}
                    `}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`
                        text-sm font-medium
                        ${isToday(day) ? "text-primary" : "text-foreground"}
                      `}>
                        {format(day, "d")}
                      </span>
                      {daySessions && daySessions.length > 0 && (
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                          {daySessions.length}
                        </span>
                      )}
                    </div>
                    <AnimatePresence>
                      {daySessions && daySessions.length > 0 && (
                        <motion.div
                          className="mt-2 space-y-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {daySessions.map((session) => (
                            <motion.div
                              key={session._id}
                              className="p-2 bg-primary/5 rounded-md text-xs space-y-1"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                            >
                              <div className="font-medium truncate">{session.title}</div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{session.startTime} - {session.endTime}</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Users className="h-3 w-3" />
                                <span>{session.attendees?.length || 0} attending</span>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

