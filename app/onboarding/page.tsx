"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, Loader2, GraduationCap, Calendar, Users, Bell, X, Plus } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

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
  const createUser = useMutation(api.users.create)
  const getUser = useQuery(api.users.getByClerkId, { clerkId: user?.id || "" })

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
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (isLoaded && user && getUser) {
      router.push("/dashboard")
    }
  }, [isLoaded, user, getUser, router])

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

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setIsTransitioning(true)
      await new Promise((resolve) => setTimeout(resolve, 300))
      setCurrentStep(currentStep + 1)
      setIsTransitioning(false)
    }
  }

  const handleBack = async () => {
    if (currentStep > 0) {
      setIsTransitioning(true)
      await new Promise((resolve) => setTimeout(resolve, 300))
      setCurrentStep(currentStep - 1)
      setIsTransitioning(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded || !user) return

    const promise = new Promise(async (resolve, reject) => {
    try {
        const clerkId = user.id
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

        localStorage.setItem("convexUserId", userId)
        resolve(userId)
      } catch (error) {
        console.error("Error creating user profile:", error)
        reject(error)
      }
    })

    toast.promise(promise, {
      loading: 'Creating your profile...',
      success: () => {
      router.push("/dashboard")
        return 'Profile created successfully! Redirecting to dashboard...'
      },
      error: 'There was a problem setting up your profile. Please try again.',
    })
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-white/60">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/sign-in")
    return null
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <main className="container max-w-lg mx-auto py-12 px-4">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to StudySync</h1>
            <p className="text-white/60">
              Let's set up your profile to help you find the perfect study groups.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              {steps.map((step, index) => (
                <div key={step.title} className="flex items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200",
                      index <= currentStep
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-white/20 text-white/40"
                    )}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 w-10 transition-colors duration-200",
                        index < currentStep ? "bg-primary" : "bg-white/20"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <Progress 
              value={(currentStep / (steps.length - 1)) * 100} 
              className="h-1 bg-white/10" 
            />
          </div>

          <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
                <p className="text-white/60">{steps[currentStep].description}</p>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {currentStep === 0 && (
                    <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                          <Label className="text-white/60">University</Label>
                    <Input
                      placeholder="Enter your university"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      required
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                          <Label className="text-white/60">Major</Label>
                    <Input
                      placeholder="Enter your major"
                      value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                      required
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                        <Label className="text-white/60">Year</Label>
                  <Select
                    value={formData.year}
                    onValueChange={(value) => setFormData({ ...formData, year: value })}
                    required
                  >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select your year" />
                    </SelectTrigger>
                          <SelectContent className="bg-black/90 border-white/10">
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
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                        />
                        <Button 
                          type="button" 
                          onClick={handleAddCourse} 
                          className="shrink-0 bg-primary hover:bg-primary/90"
                        >
                          <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.courses.length > 0 ? (
                    <div className="space-y-2">
                      {formData.courses.map((course) => (
                            <div
                              key={course}
                              className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2"
                            >
                          <span>{course}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveCourse(course)}
                                className="hover:bg-white/10 text-white/60 hover:text-white"
                              >
                                <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                        <p className="text-sm text-white/60 text-center">
                          No courses added yet. Add your current courses to find study groups.
                        </p>
                      )}
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white/60">Preferred Study Time</Label>
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
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select your preferred study time" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-white/10">
                            <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                            <SelectItem value="evening">Evening (6PM - 12AM)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/60">Preferred Group Size</Label>
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
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select your preferred group size" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-white/10">
                            <SelectItem value="small">Small (2-4 people)</SelectItem>
                            <SelectItem value="medium">Medium (5-8 people)</SelectItem>
                            <SelectItem value="large">Large (9+ people)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/60">Study Style</Label>
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
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select your study style" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-white/10">
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
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="newGroups"
                          checked={formData.notifications.newGroups}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              notifications: { ...formData.notifications, newGroups: checked as boolean },
                            })
                          }
                          className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label
                          htmlFor="newGroups"
                          className="text-sm font-medium text-white"
                        >
                          Get notified about new study groups for my courses
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="studyReminders"
                          checked={formData.notifications.studyReminders}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              notifications: { ...formData.notifications, studyReminders: checked as boolean },
                            })
                          }
                          className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label
                          htmlFor="studyReminders"
                          className="text-sm font-medium text-white"
                        >
                          Receive study session reminders
                        </label>
                </div>

                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="messages"
                          checked={formData.notifications.messages}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              notifications: { ...formData.notifications, messages: checked as boolean },
                            })
                          }
                          className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                  <label
                          htmlFor="messages"
                          className="text-sm font-medium text-white"
                        >
                          Get notified about new messages
                        </label>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between pt-6 border-t border-white/10">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 0 || isSubmitting}
                  className="text-white hover:bg-white/10"
                >
                  Back
                </Button>
                {currentStep === steps.length - 1 ? (
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90"
                  >
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
                  <Button 
                    type="button" 
                    onClick={handleNext} 
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Next
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

