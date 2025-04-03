"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import DashboardShell from "@/components/dashboard/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Loader2, Send } from "lucide-react"
import { useState } from "react"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"

export default function GroupChatPage() {
  const { groupId } = useParams()
  const { user, isLoaded } = useUser()
  const profile = useQuery(api.users.getByClerkId, { clerkId: user?.id || "" })
  const group = useQuery(api.groups.get, { id: groupId as Id<"groups"> })
  const messages = useQuery(api.messages.getByGroup, { groupId: groupId as Id<"groups"> })
  const sendMessage = useMutation(api.messages.send)

  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  if (!isLoaded || !group || !profile) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardShell>
    )
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setIsSending(true)
    try {
      await sendMessage({
        groupId: groupId as Id<"groups">,
        content: newMessage.trim(),
      })
      setNewMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <DashboardShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {group.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {!messages ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-1">No messages yet</h3>
                <p className="text-muted-foreground">
                  Start the conversation by sending a message.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.userId === profile._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.userId === profile._id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSending}
              />
              <Button type="submit" disabled={isSending || !newMessage.trim()}>
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </DashboardShell>
  )
} 