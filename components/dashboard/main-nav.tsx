"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Groups",
    href: "/groups",
  },
  {
    title: "Calendar",
    href: "/calendar",
  },
  {
    title: "Messages",
    href: "/messages",
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="hidden font-bold sm:inline-block">StudySync</span>
      </Link>
      <nav className="flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href || pathname?.startsWith(`${item.href}/`)
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}

