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
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Loader2, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { formatDistanceToNow } from "date-fns"

interface GroupResourcesProps {
  groupId: string
  userId: string
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Please enter a valid URL"),
})

export function GroupResources({ groupId, userId }: GroupResourcesProps) {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resources = useQuery(api.resources.getForGroup, { groupId })
  const users = useQuery(api.users.getAll)
  const uploadResource = useMutation(api.resources.upload)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  })

  const getUserById = (userId: string) => {
    return users?.find((user) => user._id === userId)
  }

  const getFileType = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return "PDF"
      case "doc":
      case "docx":
        return "DOC"
      case "ppt":
      case "pptx":
        return "PPT"
      case "xls":
      case "xlsx":
        return "XLS"
      case "txt":
        return "TXT"
      default:
        return "FILE"
    }
  }

  const formatTimestamp = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
      await uploadResource({
        groupId,
        name: values.name,
        type: getFileType(values.url),
        url: values.url,
        uploadedBy: userId,
      })

      toast({
        title: "Resource uploaded!",
        description: "Your study resource has been shared with the group.",
      })

      form.reset()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error uploading resource:", error)
      toast({
        title: "Error",
        description: "Failed to upload the resource. Please try again.",
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
              <CardTitle>Study Materials</CardTitle>
              <CardDescription>Shared resources and study materials for this group.</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Upload Resource
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share a Study Resource</DialogTitle>
                  <DialogDescription>Upload a link to a study resource to share with your group.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resource Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Lecture Notes - Week 1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resource URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
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
                            Uploading...
                          </>
                        ) : (
                          "Upload Resource"
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
            {resources && users ? (
              resources.length > 0 ? (
                [...resources]
                  .sort((a, b) => b.uploadedAt - a.uploadedAt)
                  .map((resource) => {
                    const uploader = getUserById(resource.uploadedBy)
                    return (
                      <div
                        key={resource._id}
                        className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="grid gap-1 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{resource.name}</h3>
                            <Badge variant="outline">{resource.type}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Uploaded by {uploader?.name || "Unknown User"} {formatTimestamp(resource.uploadedAt)}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Button size="sm" variant="outline" asChild>
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                View
                              </a>
                            </Button>
                            <Button size="sm" asChild>
                              <a href={resource.url} download>
                                Download
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-1">No resources yet</h3>
                  <p className="text-muted-foreground mb-4">This group doesn't have any shared study materials yet.</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Upload a Resource</Button>
                    </DialogTrigger>
                    <DialogContent>{/* Resource upload form */}</DialogContent>
                  </Dialog>
                </div>
              )
            ) : (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-8 w-24 rounded-md" />
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

