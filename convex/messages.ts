import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const getForGroup = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .order("desc")
      .take(50)
  },
})

export const send = mutation({
  args: {
    groupId: v.id("groups"),
    userId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const group = await ctx.db.get(args.groupId)

    if (!group) {
      throw new Error("Group not found")
    }

    // Check if user is a member
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first()

    if (!membership) {
      throw new Error("User is not a member of this group")
    }

    return await ctx.db.insert("messages", {
      groupId: args.groupId,
      userId: args.userId,
      content: args.content,
      timestamp: Date.now(),
    })
  },
})

