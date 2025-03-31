import { api } from "@/convex/_generated/api"
import { ConvexHttpClient } from "convex/browser"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function getGroupDetails(groupId: string) {
  try {
    const group = await convex.query(api.groups.get, { id: groupId })

    if (!group) {
      return null
    }

    // Get additional data like unread messages count
    const messages = await convex.query(api.messages.getForGroup, { groupId })
    const unreadMessages = messages.length > 0 ? 0 : 0 // In a real app, this would be calculated based on last read timestamp

    return {
      ...group,
      unreadMessages,
    }
  } catch (error) {
    console.error("Error fetching group details:", error)
    return null
  }
}

