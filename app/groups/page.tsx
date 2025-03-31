import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import Link from "next/link"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { GroupsList } from "@/components/groups/groups-list"
import { Plus } from "lucide-react"

export default async function GroupsPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Study Groups" text="Manage your study groups and find new ones to join.">
        <Link href="/groups/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Group
          </Button>
        </Link>
      </DashboardHeader>

      <GroupsList />
    </DashboardShell>
  )
}

