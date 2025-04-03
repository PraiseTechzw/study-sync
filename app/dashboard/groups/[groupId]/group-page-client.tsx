"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GroupSessions } from "@/components/groups/group-sessions"

export default function GroupPageClient({ groupId }: { groupId: string }) {
  const { user, isLoaded } = useUser()
  const profile = useQuery(api.users.getByClerkId, { 
    clerkId: user?.id || undefined 
  })
  const group = useQuery(api.groups.getById, { 
    groupId 
  })

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Profile not found</h1>
        <p className="text-muted-foreground">Please complete your onboarding.</p>
        <Link href="/onboarding" className="text-primary hover:underline mt-4">
          Complete Onboarding
        </Link>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Group not found</h1>
        <p className="text-muted-foreground">The group you're looking for doesn't exist.</p>
        <Link href="/dashboard/groups" className="text-primary hover:underline mt-4">
          Back to Groups
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
          <p className="text-muted-foreground">{group.course}</p>
        </div>
        <Link href="/dashboard/groups">
          <Button variant="outline">Back to Groups</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Group Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{group.description}</p>
          </CardContent>
        </Card>

        {profile._id && (
          <GroupSessions groupId={groupId} userId={profile._id} />
        )}
      </div>
    </div>
  )
} 