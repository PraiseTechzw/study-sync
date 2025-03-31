import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Calendar, Users, MessageSquare, FileText, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b sticky top-0 z-50 bg-background">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">StudySync</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="mb-2" variant="outline">
                    University Innovation Hub
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Find Your Perfect Study Group
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Connect with classmates, schedule study sessions, and improve your academic performance with
                    StudySync.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/sign-up">
                    <Button size="lg" className="gap-1">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Free for students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 rounded-xl overflow-hidden border bg-card shadow-sm">
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Active Study Groups</h3>
                    <p className="text-sm text-muted-foreground">Join an existing group or create your own</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        title: "CS 101: Introduction to Programming",
                        members: 8,
                        nextSession: "Today, 4:00 PM",
                        active: true,
                      },
                      {
                        title: "MATH 240: Linear Algebra",
                        members: 5,
                        nextSession: "Tomorrow, 2:30 PM",
                        active: false,
                      },
                      {
                        title: "BIO 220: Cell Biology",
                        members: 6,
                        nextSession: "Wed, 5:00 PM",
                        active: false,
                      },
                    ].map((group, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div>
                          <h4 className="font-medium">{group.title}</h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" /> {group.members} members
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {group.nextSession}
                            </span>
                          </div>
                        </div>
                        {group.active && <Badge className="bg-green-500 hover:bg-green-600">Active Now</Badge>}
                        <Button size="sm" variant="secondary">
                          Join
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    View All Groups
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Everything you need to make your study sessions more productive
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 mt-12">
              {[
                {
                  icon: <Users className="h-10 w-10 text-primary" />,
                  title: "Find Study Partners",
                  description: "Connect with students in your courses who have similar study goals and schedules.",
                },
                {
                  icon: <Calendar className="h-10 w-10 text-primary" />,
                  title: "Schedule Sessions",
                  description: "Coordinate meeting times that work for everyone with our integrated calendar.",
                },
                {
                  icon: <MessageSquare className="h-10 w-10 text-primary" />,
                  title: "Real-time Chat",
                  description: "Communicate with your study group before, during, and after sessions.",
                },
                {
                  icon: <FileText className="h-10 w-10 text-primary" />,
                  title: "Share Resources",
                  description: "Upload and share study materials, notes, and practice exams with your group.",
                },
                {
                  icon: <CheckCircle className="h-10 w-10 text-primary" />,
                  title: "Track Progress",
                  description: "Monitor your study habits and track your academic progress over time.",
                },
                {
                  icon: <BookOpen className="h-10 w-10 text-primary" />,
                  title: "Course Integration",
                  description: "Organize study groups by course and access relevant course materials.",
                },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Get started with StudySync in just a few simple steps
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 mt-12">
              {[
                {
                  step: "01",
                  title: "Create Your Profile",
                  description:
                    "Sign up and create your profile with your university email, courses, and study preferences.",
                },
                {
                  step: "02",
                  title: "Join or Create Groups",
                  description: "Find existing study groups for your courses or create your own and invite classmates.",
                },
                {
                  step: "03",
                  title: "Schedule & Collaborate",
                  description:
                    "Schedule study sessions, share resources, and communicate with your group in real-time.",
                },
              ].map((step, i) => (
                <div key={i} className="relative flex flex-col items-start space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                    {step.step}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-border -translate-x-6">
                      <div className="absolute right-0 -top-1.5 h-4 w-4 rounded-full bg-primary"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Student Testimonials</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  See what other students are saying about StudySync
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
              {[
                {
                  quote:
                    "StudySync helped me find study partners in my toughest classes. My grades have improved significantly!",
                  name: "Alex Johnson",
                  role: "Computer Science Major",
                },
                {
                  quote: "The scheduling feature makes it so easy to coordinate study sessions with my classmates.",
                  name: "Jamie Smith",
                  role: "Biology Major",
                },
                {
                  quote:
                    "Being able to share resources and chat in real-time has made remote studying so much more effective.",
                  name: "Taylor Wilson",
                  role: "Business Administration Major",
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between space-y-4 rounded-xl border bg-card p-6 shadow-sm"
                >
                  <div className="space-y-2">
                    <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-medium">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
                <p className="max-w-[900px] md:text-xl/relaxed">
                  Join thousands of students who are already using StudySync to improve their academic performance.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/sign-up">
                  <Button size="lg" variant="secondary" className="gap-1">
                    Sign Up Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">StudySync</span>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-sm hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="#" className="text-sm hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
          <p className="text-center text-sm text-muted-foreground md:text-left md:ml-auto">
            © 2025 StudySync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

