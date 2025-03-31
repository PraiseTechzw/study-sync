import Link from "next/link"
import { BookOpen } from "lucide-react"

export function MainNav() {
  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Link href="/dashboard" className="flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="font-bold">StudySync</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/dashboard" className="text-sm font-medium">
          Dashboard
        </Link>
        <Link href="/groups" className="text-sm font-medium">
          Groups
        </Link>
        <Link href="/calendar" className="text-sm font-medium">
          Calendar
        </Link>
        <Link href="/messages" className="text-sm font-medium">
          Messages
        </Link>
      </nav>
    </div>
  )
}

