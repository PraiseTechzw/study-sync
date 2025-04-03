import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getUserIdentity } from "./auth.config"

export const getMessages = query({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .order("desc")
      .collect()

    return messages
  },
})

export const sendMessage = mutation({
  args: {
    groupId: v.id("groups"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdentity(ctx)
    
    const message = await ctx.db.insert("messages", {
      groupId: args.groupId,
      content: args.content,
      userId: userId,
      timestamp: Date.now(),
    })

    return message
  },
})

