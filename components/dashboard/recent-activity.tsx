"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Calendar, FileText, MessageSquare } from "lucide-react"

interface RecentActivityProps {
  className?: string
}

export function RecentActivity({ className }: RecentActivityProps) {
  const { user } = useUser()
  const userId = user?.id

  const messages = useQuery(api.messages.getRecent, userId ? { userId } : "skip")
  const sessions = useQuery(api.sessions.getRecent, userId ? { userId } : "skip")
  const resources = useQuery(api.resources.getRecent, userId ? { userId } : "skip")

  // Combine and sort all activities by timestamp
  const activities =
    messages && sessions && resources
      ? [
          ...messages.map((msg) => ({
            type: "message",
            data: msg,
            timestamp: msg.timestamp,
          })),
          ...sessions.map((session) => ({
            type: "session",
            data: session,
            timestamp: new Date(session.date).getTime(),
          })),
          ...resources.map((resource) => ({
            type: "resource",
            data: resource,
            timestamp: resource.uploadedAt,
          })),
        ]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 5)
      : null

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4" />
      case "session":
        return <Calendar className="h-4 w-4" />
      case "resource":
        return <FileText className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case "message":
        return `New message in ${activity.data.groupName}`
      case "session":
        return `Study session scheduled for ${activity.data.topic}`
      case "resource":
        return `New resource: ${activity.data.name}`
      default:
        return "Activity"
    }
  }

  const getActivityTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Stay updated with your latest study group activities.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities ? (
            activities.length > 0 ? (
              activities.map((activity, i) => (
                <div key={i} className="flex items-center">
                  <Avatar className="h-9 w-9 mr-4">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10">{getActivityIcon(activity.type)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{getActivityText(activity)}</p>
                    <p className="text-sm text-muted-foreground">{getActivityTime(activity.timestamp)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No recent activity to display.
              </div>
            )
          ) : (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-9 w-9 rounded-full mr-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-3 w-[200px]" />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

