"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Search, Users } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export function GroupsList() {
  const { user } = useUser()
  const userId = user?.id
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")

  const userProfile = useQuery(api.users.getByClerkId, userId ? { clerkId: userId } : "skip")
  const myGroups = useQuery(api.groups.getForUser, userProfile ? { userId: userProfile._id } : "skip")
  const allGroups = useQuery(api.groups.getAll)

  const joinGroup = useMutation(api.groups.join)

  const filteredMyGroups = myGroups?.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.course.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredAllGroups = allGroups?.filter(
    (group) =>
      (group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.course.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!myGroups || !myGroups.some((myGroup) => myGroup._id === group._id)),
  )

  const handleJoinGroup = async (groupId: string) => {
    if (!userProfile) return

    try {
      await joinGroup({ groupId, userId: userProfile._id })
      toast({
        title: "Success!",
        description: "You have joined the group.",
      })
    } catch (error) {
      console.error("Error joining group:", error)
      toast({
        title: "Error",
        description: "Failed to join the group. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search groups by name or course..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="my-groups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        <TabsContent value="my-groups" className="space-y-4">
          {filteredMyGroups ? (
            filteredMyGroups.length > 0 ? (
              filteredMyGroups.map((group) => (
                <Card key={group._id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="grid gap-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        <Badge variant="outline">{group.course}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> {group.members.length} members
                        </span>
                        {group.createdBy === userProfile?._id && <Badge variant="secondary">Admin</Badge>}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button asChild>
                          <Link href={`/groups/${group._id}`}>View Group</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-1">No study groups found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "No groups match your search criteria." : "You haven't joined any study groups yet."}
                </p>
                <Link href="/groups/create">
                  <Button>Create a Group</Button>
                </Link>
              </div>
            )
          ) : (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-9 w-24 rounded-md" />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          {filteredAllGroups ? (
            filteredAllGroups.length > 0 ? (
              filteredAllGroups.map((group) => (
                <Card key={group._id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="grid gap-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        <Badge variant="outline">{group.course}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> {group.members.length} members
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button variant="outline" asChild>
                          <Link href={`/groups/${group._id}`}>View</Link>
                        </Button>
                        <Button onClick={() => handleJoinGroup(group._id)}>Join Group</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-1">No groups found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "No groups match your search criteria."
                    : "There are no public groups available to join."}
                </p>
                <Link href="/groups/create">
                  <Button>Create a Group</Button>
                </Link>
              </div>
            )
          ) : (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-9 w-24 rounded-md" />
                      <Skeleton className="h-9 w-24 rounded-md" />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

