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
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function CreateGroupPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const profile = useQuery(api.users.getByClerkId, { clerkId: user?.id || "" })
  const createGroup = useMutation(api.groups.create)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    course: "",
    maxMembers: "5",
    meetingTime: "",
    meetingLocation: "",
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

    const promise = createGroup({
      name: formData.name,
      course: formData.course,
      description: formData.description,
      createdBy: profile._id,
      isPublic: true
    })

    toast.promise(promise, {
      loading: "Creating your study group...",
      success: () => {
        router.push("/dashboard/groups")
        return "Study group created successfully!"
      },
      error: "Failed to create study group. Please try again.",
    })
  }

  return (
    <DashboardShell>
      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Create a Study Group</CardTitle>
            <CardDescription>
              Fill out the form below to create a new study group for your course.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Group Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter group name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Input
                      id="course"
                      placeholder="e.g., CS 101"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your study group's goals and expectations"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="maxMembers">Maximum Members</Label>
                    <Select
                      value={formData.maxMembers}
                      onValueChange={(value) => setFormData({ ...formData, maxMembers: value })}
                      required
                    >
                      <SelectTrigger id="maxMembers">
                        <SelectValue placeholder="Select max members" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 members</SelectItem>
                        <SelectItem value="5">5 members</SelectItem>
                        <SelectItem value="8">8 members</SelectItem>
                        <SelectItem value="10">10 members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meetingTime">Meeting Time</Label>
                    <Input
                      id="meetingTime"
                      placeholder="e.g., Mondays at 3 PM"
                      value={formData.meetingTime}
                      onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meetingLocation">Meeting Location</Label>
                  <Input
                    id="meetingLocation"
                    placeholder="e.g., Library Room 204 or Zoom"
                    value={formData.meetingLocation}
                    onChange={(e) => setFormData({ ...formData, meetingLocation: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Group...
                  </>
                ) : (
                  "Create Study Group"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
} 