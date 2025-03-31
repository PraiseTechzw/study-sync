"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BookOpen, Menu } from "lucide-react"
import { UserNav } from "@/components/dashboard/user-nav"

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

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <div className="flex items-center space-x-2 mb-8">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold">StudySync</span>
          </div>
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
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
          <div className="mt-auto pt-4 border-t">
            <UserNav />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

