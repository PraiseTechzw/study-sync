import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const getByGroup = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .order("desc")
      .collect()
  },
})

export const send = mutation({
  args: {
    groupId: v.id("groups"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Unauthorized")

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first()

    if (!user) throw new Error("User not found")

    // Check if user is a member of the group
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first()

    if (!membership) throw new Error("Not a member of this group")

    return await ctx.db.insert("messages", {
      groupId: args.groupId,
      userId: user._id,
      content: args.content,
      timestamp: Date.now(),
    })
  },
})

