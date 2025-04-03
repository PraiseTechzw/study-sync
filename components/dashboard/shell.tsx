"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BookOpen, Calendar, Users, MessageSquare, Settings, LogOut, ChevronLeft, ChevronRight, Bell, Search, Plus } from "lucide-react"
import { SignOutButton, useUser } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BookOpen,
  },
  {
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    name: "Groups",
    href: "/dashboard/groups",
    icon: Users,
  },
  {
    name: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
]

const quickActions = [
  {
    name: "New Study Group",
    icon: Plus,
    href: "/dashboard/groups/new",
  },
  {
    name: "Schedule Meeting",
    icon: Calendar,
    href: "/dashboard/calendar/new",
  },
]

interface DashboardShellProps {
  children: React.ReactNode
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname()
  const { user } = useUser()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const convexUserId = localStorage.getItem("convexUserId")

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 z-50 flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-72"
      )}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="ml-2 text-xl font-bold text-white">StudySync</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          </div>

          {/* User Profile Section */}
          {!isCollapsed && (
            <div className="flex items-center gap-x-4 py-4 border-t border-gray-800">
              <Avatar>
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">{user?.fullName}</span>
                <span className="text-xs text-gray-400">{user?.primaryEmailAddress?.emailAddress}</span>
              </div>
            </div>
          )}

          {/* Search Bar */}
          {!isCollapsed && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="w-full bg-gray-800 border-gray-700 pl-10 text-white placeholder:text-gray-400"
              />
            </div>
          )}

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          pathname === item.href
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-800",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors duration-200"
                        )}
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {!isCollapsed && item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Quick Actions */}
              {!isCollapsed && (
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider">Quick Actions</div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {quickActions.map((action) => (
                      <li key={action.name}>
                        <Link
                          href={action.href}
                          className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                        >
                          <action.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                          {action.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              )}

              <li className="mt-auto">
                <SignOutButton>
                  <button
                    className="text-gray-400 hover:text-white hover:bg-gray-800 -mx-2 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full transition-colors duration-200"
                  >
                    <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {!isCollapsed && "Sign Out"}
                  </button>
                </SignOutButton>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isCollapsed ? "pl-20" : "pl-72"
      )}>
        <div className="px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  )
} 