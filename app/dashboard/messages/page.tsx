"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import DashboardShell from "@/components/dashboard/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Loader2 } from "lucide-react"
import Link from "next/link"

export default function MessagesPage() {
  const { user, isLoaded } = useUser()
  const profile = useQuery(api.users.getByClerkId, { 
    clerkId: user?.id || "" 
  })
  // Only run the groups query if we have a valid profile ID
  const groups = profile?._id ? useQuery(api.groups.getForUser, { 
    userId: profile._id 
  }) : null

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
          <div>
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-muted-foreground">Chat with your study groups</p>
          </div>

          <div className="grid gap-4">
            {!groups ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : groups.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-1">No group chats yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Join a study group to start chatting with other students.
                  </p>
                  <Link 
                    href="/dashboard/groups" 
                    className="text-primary hover:underline"
                  >
                    Browse Study Groups
                  </Link>
                </CardContent>
              </Card>
            ) : (
              groups.map((group) => (
                <Link key={group._id} href={`/dashboard/messages/${group._id}`}>
                  <Card className="transition-colors hover:bg-accent">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
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
      )}
    </DashboardShell>
  )
} 