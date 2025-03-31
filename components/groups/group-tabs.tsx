"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GroupChat } from "@/components/groups/group-chat"
import { GroupSessions } from "@/components/groups/group-sessions"
import { GroupResources } from "@/components/groups/group-resources"
import { GroupMembers } from "@/components/groups/group-members"

interface GroupTabsProps {
  groupId: string
  userId: string
}

export function GroupTabs({ groupId, userId }: GroupTabsProps) {
  return (
    <Tabs defaultValue="chat" className="space-y-4">
      <TabsList>
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
      </TabsList>

      <TabsContent value="chat">
        <GroupChat groupId={groupId} userId={userId} />
      </TabsContent>

      <TabsContent value="sessions">
        <GroupSessions groupId={groupId} userId={userId} />
      </TabsContent>

      <TabsContent value="resources">
        <GroupResources groupId={groupId} userId={userId} />
      </TabsContent>

      <TabsContent value="members">
        <GroupMembers groupId={groupId} userId={userId} />
      </TabsContent>
    </Tabs>
  )
}

