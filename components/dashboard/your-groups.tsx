"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import Link from "next/link"

interface YourGroupsProps {
  userId: Id<"users">
}

export default function YourGroups({ userId }: YourGroupsProps) {
  const groups = useQuery(api.groups.getByUser, { userId })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Your Groups</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {!groups?.length ? (
          <p className="text-sm text-muted-foreground">
            You haven't joined any study groups yet.
          </p>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <Link key={group._id} href={`/groups/${group._id}`}>
                <div className="flex items-center space-x-4 rounded-md border p-4 hover:bg-accent">
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {group.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {group.subject} • {group.members.length} members
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 