"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, Loader2, MapPin, Plus, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

interface GroupSessionsProps {
  groupId: string
  userId: string
}

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  topic: z.string().min(1, "Topic is required"),
  description: z.string().optional(),
})

export function GroupSessions({ groupId, userId }: GroupSessionsProps) {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sessions = useQuery(api.sessions.getForGroup, { groupId })
  const createSession = useMutation(api.sessions.create)
  const attendSession = useMutation(api.sessions.attend)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      startTime: "",
      endTime: "",
      location: "",
      topic: "",
      description: "",
    },
  })

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split("T")[0]
    return dateString === today
  }

  const isFutureDate = (dateString: string) => {
    const today = new Date().toISOString().split("T")[0]
    return dateString >= today
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (dateString === today.toISOString().split("T")[0]) {
      return "Today"
    } else if (dateString === tomorrow.toISOString().split("T")[0]) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    }
  }

  const handleAttendSession = async (sessionId: string) => {
    try {
      await attendSession({ sessionId, userId })
      toast({
        title: "Success!",
        description: "You are now attending this session.",
      })
    } catch (error) {
      console.error("Error attending session:", error)
      toast({
        title: "Error",
        description: "Failed to join the session. Please try again.",
        variant: "destructive",
      })
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
      await createSession({
        groupId,
        date: values.date,
        startTime: values.startTime,
        endTime: values.endTime,
        location: values.location,
        topic: values.topic,
        description: values.description,
        createdBy: userId,
      })

      toast({
        title: "Session created!",
        description: "Your study session has been scheduled successfully.",
      })

      form.reset()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error creating session:", error)
      toast({
        title: "Error",
        description: "Failed to create the session. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Study Sessions</CardTitle>
              <CardDescription>Upcoming and past study sessions for this group.</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Schedule Session
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule a Study Session</DialogTitle>
                  <DialogDescription>Create a new study session for your group.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="endTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Midterm Review" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Library, Room 204" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add details about what will be covered in this session"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Session"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions ? (
              sessions.length > 0 ? (
                [...sessions]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((session) => (
                    <div
                      key={session._id}
                      className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div className="grid gap-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{session.topic}</h3>
                          {isToday(session.date) && <Badge>Today</Badge>}
                        </div>
                        <div className="grid gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" /> {formatDate(session.date)}, {session.startTime} -{" "}
                            {session.endTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> {session.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" /> {session.attendees.length} attendees
                          </div>
                          {session.description && <p className="mt-1">{session.description}</p>}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {isFutureDate(session.date) && !session.attendees.includes(userId) && (
                            <Button size="sm" onClick={() => handleAttendSession(session._id)}>
                              Attend
                            </Button>
                          )}
                          {isFutureDate(session.date) && session.attendees.includes(userId) && (
                            <Badge variant="outline">Attending</Badge>
                          )}
                          {isToday(session.date) && session.attendees.includes(userId) && (
                            <Button size="sm">Join Session</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-1">No sessions scheduled</h3>
                  <p className="text-muted-foreground mb-4">
                    This group doesn't have any study sessions scheduled yet.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Schedule a Session</Button>
                    </DialogTrigger>
                    <DialogContent>{/* Session creation form */}</DialogContent>
                  </Dialog>
                </div>
              )
            ) : (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-full max-w-[200px]" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

