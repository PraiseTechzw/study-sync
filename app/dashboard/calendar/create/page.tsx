"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import DashboardShell from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Loader2, ArrowLeft, Calendar as CalendarIcon } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { toast } from "sonner"

export default function CreateSessionPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const profile = useQuery(api.users.getByClerkId, { clerkId: user?.id || "" })
  const createSession = useMutation(api.sessions.create)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    startTime: "",
    endTime: "",
    groupId: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isLoaded) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardShell>
    )
  }

  if (!profile) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <p className="text-muted-foreground">Please complete your onboarding.</p>
          <Link href="/onboarding" className="text-primary hover:underline mt-4">
            Complete Onboarding
          </Link>
        </div>
      </DashboardShell>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const promise = createSession({
      title: formData.title,
      description: formData.description,
      date: format(formData.date, "yyyy-MM-dd"),
      startTime: formData.startTime,
      endTime: formData.endTime,
      groupId: formData.groupId as any,
      createdBy: profile._id,
    })

    toast.promise(promise, {
      loading: "Creating your study session...",
      success: () => {
        router.push("/dashboard/calendar")
        return "Study session created successfully!"
      },
      error: "Failed to create study session. Please try again.",
    })
  }

  return (
    <DashboardShell>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <Link
            href="/dashboard/calendar"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Calendar
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Schedule a Study Session</CardTitle>
            <CardDescription>
              Create a new study session for your group.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Session Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., CS 101 Midterm Review"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you'll be studying..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(formData.date, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => date && setFormData({ ...formData, date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="groupId">Study Group</Label>
                    <Select
                      value={formData.groupId}
                      onValueChange={(value) => setFormData({ ...formData, groupId: value })}
                      required
                    >
                      <SelectTrigger id="groupId">
                        <SelectValue placeholder="Select a group" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Add groups here */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Session...
                  </>
                ) : (
                  "Schedule Session"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
} 