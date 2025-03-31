"use client"

import { useState } from "react"
import Link from "next/link"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, ChevronLeft, Share2, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface GroupHeaderProps {
  group: any
  userId: string
}

export function GroupHeader({ group, userId }: GroupHeaderProps) {
  const { toast } = useToast()
  const [isJoining, setIsJoining] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const joinGroup = useMutation(api.groups.join)
  const leaveGroup = useMutation(api.groups.leave)

  const isMember = group.members.includes(userId)
  const isAdmin = group.admins.includes(userId)

  const handleJoinGroup = async () => {
    try {
      setIsJoining(true)
      await joinGroup({ groupId: group._id, userId })
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
    } finally {
      setIsJoining(false)
    }
  }

  const handleLeaveGroup = async () => {
    try {
      setIsLeaving(true)
      await leaveGroup({ groupId: group._id, userId })
      toast({
        title: "Success!",
        description: "You have left the group.",
      })
    } catch (error) {
      console.error("Error leaving group:", error)
      toast({
        title: "Error",
        description: "Failed to leave the group. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLeaving(false)
    }
  }

  const handleShareGroup = () => {
    if (navigator.share) {
      navigator
        .share({
          title: group.name,
          text: `Join my study group: ${group.name}`,
          url: window.location.href,
        })
        .catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Group link copied to clipboard.",
      })
    }
  }

  if (!group) {
    return (
      <div className="space-y-2 mb-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
    )
  }

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center gap-2">
        <Link href="/groups">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{group.name}</h1>
          <Badge variant="outline">{group.course}</Badge>
          {isAdmin && <Badge variant="secondary">Admin</Badge>}
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={handleShareGroup}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
          {!isMember ? (
            <Button size="sm" onClick={handleJoinGroup} disabled={isJoining}>
              {isJoining ? "Joining..." : "Join Group"}
            </Button>
          ) : (
            !isAdmin && (
              <Button size="sm" variant="outline" onClick={handleLeaveGroup} disabled={isLeaving}>
                {isLeaving ? "Leaving..." : "Leave Group"}
              </Button>
            )
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{group.course}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{group.members.length} members</span>
        </div>
      </div>

      <p className="text-muted-foreground">{group.description}</p>
    </div>
  )
}

