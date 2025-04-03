"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BookOpen, Calendar, Users, MessageSquare, Settings, LogOut } from "lucide-react"
import { SignOutButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

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

interface DashboardShellProps {
  children: React.ReactNode
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="ml-2 text-xl font-bold text-white">StudySync</span>
          </div>
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
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <SignOutButton>
                  <button
                    className="text-gray-400 hover:text-white hover:bg-gray-800 -mx-2 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full"
                  >
                    <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
                    Sign Out
                  </button>
                </SignOutButton>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className="pl-72 w-full">
        <div className="px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  )
} 