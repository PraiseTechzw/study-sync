import { use } from "react"
import DashboardShell from "@/components/dashboard/shell"
import GroupPageClient from "./group-page-client"

export default function GroupPage({ params }: { params: Promise<{ groupId: string }> }) {
  const resolvedParams = use(params)
  
  return (
    <DashboardShell>
      <GroupPageClient groupId={resolvedParams.groupId} />
    </DashboardShell>
  )
} 