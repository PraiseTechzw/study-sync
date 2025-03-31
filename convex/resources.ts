import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const getForGroup = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resources")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect()
  },
})

export const upload = mutation({
  args: {
    groupId: v.id("groups"),
    name: v.string(),
    type: v.string(),
    url: v.string(),
    uploadedBy: v.id("users"),
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
      .filter((q) => q.eq(q.field("userId"), args.uploadedBy))
      .first()

    if (!membership) {
      throw new Error("User is not a member of this group")
    }

    return await ctx.db.insert("resources", {
      groupId: args.groupId,
      name: args.name,
      type: args.type,
      url: args.url,
      uploadedBy: args.uploadedBy,
      uploadedAt: Date.now(),
    })
  },
})

