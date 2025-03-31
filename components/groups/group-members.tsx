"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface GroupMembersProps {
  groupId: string
  userId: string
}

export function GroupMembers({ groupId, userId }: GroupMembersProps) {
  const group = useQuery(api.groups.get, { id: groupId })
  const users = useQuery(api.users.getAll)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getMemberDetails = (memberId: string) => {
    return users?.find((user) => user._id === memberId)
  }

  const isAdmin = (memberId: string) => {
    return group?.admins.includes(memberId)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Members</CardTitle>
        <CardDescription>{group && `${group.members.length} members in this study group`}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {group && users
            ? group.members.map((memberId) => {
                const member = getMemberDetails(memberId)
                if (!member) return null

                return (
                  <div
                    key={memberId}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.imageUrl || ""} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{member.name}</span>
                        {isAdmin(memberId) && <Badge variant="secondary">Admin</Badge>}
                        {memberId === userId && <Badge variant="outline">You</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{member.major}</p>
                    </div>
                  </div>
                )
              })
            : Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  )
}

