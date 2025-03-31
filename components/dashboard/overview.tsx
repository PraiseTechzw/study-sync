"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface OverviewProps {
  className?: string
}

export function Overview({ className }: OverviewProps) {
  const { user } = useUser()
  const userId = user?.id

  const sessions = useQuery(api.sessions.getForUser, userId ? { userId } : "skip")
  const groups = useQuery(api.groups.getForUser, userId ? { userId } : "skip")

  const [stats, setStats] = useState({
    totalSessions: 0,
    totalHours: 0,
    totalGroups: 0,
    weeklyData: [] as { name: string; hours: number }[],
  })

  useEffect(() => {
    if (sessions && groups) {
      // Calculate total study hours
      const totalHours = sessions.reduce((acc, session) => {
        const start = new Date(`2023-01-01T${session.startTime}`)
        const end = new Date(`2023-01-01T${session.endTime}`)
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        return acc + hours
      }, 0)

      // Generate weekly data
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      const weeklyData = days.map((day) => {
        const daySessions = sessions.filter((session) => {
          const sessionDate = new Date(session.date)
          return sessionDate.toLocaleDateString("en-US", { weekday: "short" }) === day
        })

        const hours = daySessions.reduce((acc, session) => {
          const start = new Date(`2023-01-01T${session.startTime}`)
          const end = new Date(`2023-01-01T${session.endTime}`)
          const sessionHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
          return acc + sessionHours
        }, 0)

        return { name: day, hours: Number.parseFloat(hours.toFixed(1)) }
      })

      setStats({
        totalSessions: sessions.length,
        totalHours: Number.parseFloat(totalHours.toFixed(1)),
        totalGroups: groups.length,
        weeklyData,
      })
    }
  }, [sessions, groups])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Study Overview</CardTitle>
        <CardDescription>Track your study habits and progress over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {sessions ? (
                    <div className="text-2xl font-bold">{stats.totalSessions}</div>
                  ) : (
                    <Skeleton className="h-8 w-20" />
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  {sessions ? (
                    <div className="text-2xl font-bold">{stats.totalHours} hrs</div>
                  ) : (
                    <Skeleton className="h-8 w-20" />
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  {groups ? (
                    <div className="text-2xl font-bold">{stats.totalGroups}</div>
                  ) : (
                    <Skeleton className="h-8 w-20" />
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 h-[200px]">
              {sessions ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-[200px] w-full" />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="monthly">
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Monthly statistics will be available soon.
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

