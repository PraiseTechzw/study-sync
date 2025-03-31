"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, Loader2, GraduationCap, Calendar, Users, Bell } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

const steps = [
  {
    title: "Basic Info",
    description: "Tell us about your academic background",
    icon: GraduationCap,
  },
  {
    title: "Course Selection",
    description: "Add your current courses",
    icon: Calendar,
  },
  {
    title: "Study Preferences",
    description: "Set up your study preferences",
    icon: Users,
  },
  {
    title: "Notifications",
    description: "Choose your notification settings",
    icon: Bell,
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const createUser = useMutation(api.users.create)

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    university: "",
    major: "",
    year: "",
    courses: [] as string[],
    courseInput: "",
    studyPreferences: {
      preferredTime: "",
      groupSize: "",
      studyStyle: "",
    },
    notifications: {
      newGroups: true,
      studyReminders: true,
      messages: true,
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddCourse = () => {
    if (formData.courseInput.trim() && !formData.courses.includes(formData.courseInput.trim())) {
      setFormData({
        ...formData,
        courses: [...formData.courses, formData.courseInput.trim()],
        courseInput: "",
      })
    }
  }

  const handleRemoveCourse = (course: string) => {
    setFormData({
      ...formData,
      courses: formData.courses.filter((c) => c !== course),
    })
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded || !user) return

    try {
      setIsSubmitting(true)

      const clerkId = user.id
      console.log("Clerk user ID:", clerkId) // Debug log

      if (!clerkId) {
        throw new Error("No Clerk user ID found")
      }

      const userId = await createUser({
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        clerkId: clerkId,
        university: formData.university,
        major: formData.major,
        imageUrl: user.imageUrl,
        courses: formData.courses,
      })

      console.log("Created user with ID:", userId)

      toast({
        title: "Profile created!",
        description: "Your StudySync profile has been set up successfully.",
      })

      localStorage.setItem("convexUserId", userId)

      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating user profile:", error)
      toast({
        title: "Error",
        description: "There was a problem setting up your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/50">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">StudySync</span>
          </div>
        </div>
      </header>
      <main className="flex-1 container max-w-3xl py-12 px-4 md:px-6">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to StudySync</h1>
            <p className="text-muted-foreground">
              Let's set up your profile to help you find the perfect study groups.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              {steps.map((step, index) => (
                <div key={step.title} className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      index <= currentStep ? "border-primary bg-primary text-primary-foreground" : "border-muted"
                    }`}
                  >
                    <step.icon className="h-4 w-4" />
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 w-8 ${
                        index < currentStep ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-1" />
          </div>

          <Card className="border-none shadow-lg">
            <form onSubmit={handleSubmit}>
              <CardHeader className="text-center">
                <CardTitle>{steps[currentStep].title}</CardTitle>
                <CardDescription>{steps[currentStep].description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="university">University</Label>
                        <Input
                          id="university"
                          placeholder="Enter your university"
                          value={formData.university}
                          onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="major">Major</Label>
                        <Input
                          id="major"
                          placeholder="Enter your major"
                          value={formData.major}
                          onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Select
                        value={formData.year}
                        onValueChange={(value) => setFormData({ ...formData, year: value })}
                        required
                      >
                        <SelectTrigger id="year">
                          <SelectValue placeholder="Select your year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="freshman">Freshman</SelectItem>
                          <SelectItem value="sophomore">Sophomore</SelectItem>
                          <SelectItem value="junior">Junior</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="graduate">Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a course (e.g., CS 101)"
                        value={formData.courseInput}
                        onChange={(e) => setFormData({ ...formData, courseInput: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddCourse()
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddCourse}>
                        Add
                      </Button>
                    </div>

                    {formData.courses.length > 0 ? (
                      <div className="space-y-2">
                        {formData.courses.map((course) => (
                          <div key={course} className="flex items-center justify-between rounded-md border px-3 py-2">
                            <span>{course}</span>
                            <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveCourse(course)}>
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center">No courses added yet.</p>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Preferred Study Time</Label>
                      <Select
                        value={formData.studyPreferences.preferredTime}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            studyPreferences: { ...formData.studyPreferences, preferredTime: value },
                          })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your preferred study time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                          <SelectItem value="evening">Evening (6PM - 12AM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Preferred Group Size</Label>
                      <Select
                        value={formData.studyPreferences.groupSize}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            studyPreferences: { ...formData.studyPreferences, groupSize: value },
                          })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your preferred group size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small (2-4 people)</SelectItem>
                          <SelectItem value="medium">Medium (5-8 people)</SelectItem>
                          <SelectItem value="large">Large (9+ people)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Study Style</Label>
                      <Select
                        value={formData.studyPreferences.studyStyle}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            studyPreferences: { ...formData.studyPreferences, studyStyle: value },
                          })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your study style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="collaborative">Collaborative</SelectItem>
                          <SelectItem value="focused">Focused</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newGroups"
                        checked={formData.notifications.newGroups}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            notifications: { ...formData.notifications, newGroups: checked as boolean },
                          })
                        }
                      />
                      <label
                        htmlFor="newGroups"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Get notified about new study groups for my courses
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="studyReminders"
                        checked={formData.notifications.studyReminders}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            notifications: { ...formData.notifications, studyReminders: checked as boolean },
                          })
                        }
                      />
                      <label
                        htmlFor="studyReminders"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Receive study session reminders
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="messages"
                        checked={formData.notifications.messages}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            notifications: { ...formData.notifications, messages: checked as boolean },
                          })
                        }
                      />
                      <label
                        htmlFor="messages"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Get notified about new messages
                      </label>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  Back
                </Button>
                {currentStep === steps.length - 1 ? (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Setting up your profile...
                      </>
                    ) : (
                      "Complete Setup"
                    )}
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                )}
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}

