import { notFound, redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { GroupHeader } from "@/components/groups/group-header"
import { GroupTabs } from "@/components/groups/group-tabs"
import { getGroupDetails } from "@/lib/group-utils"

export default async function GroupPage({ params }: { params: { id: string } }) {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const groupDetails = await getGroupDetails(params.id)

  if (!groupDetails) {
    notFound()
  }

  return (
    <DashboardShell>
      <GroupHeader group={groupDetails} userId={user.id} />
      <GroupTabs groupId={params.id} userId={user.id} />
    </DashboardShell>
  )
}

