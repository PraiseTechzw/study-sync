import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const getForGroup = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessions")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect()
  },
})

export const getForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Get all sessions where the user is an attendee
    const userSessions = await ctx.db
      .query("sessionAttendees")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    const sessionIds = userSessions.map(sa => sa.sessionId)

    // Get all groups the user is a member of
    const userGroups = await ctx.db
      .query("groupMembers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    const groupIds = userGroups.map(gm => gm.groupId)

    // Get all sessions for these groups
    const groupSessions = []
    for (const groupId of groupIds) {
      const sessions = await ctx.db
        .query("sessions")
        .withIndex("by_group", (q) => q.eq("groupId", groupId))
        .collect()
      groupSessions.push(...sessions)
    }

    // Combine and deduplicate sessions
    const allSessions = [...groupSessions]
    for (const sessionId of sessionIds) {
      const session = await ctx.db.get(sessionId)
      if (session && !allSessions.some((s) => s._id === session._id)) {
        allSessions.push(session)
      }
    }

    return allSessions
  },
})

export const getUpcoming = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Get all groups the user is a member of
    const userGroups = await ctx.db
      .query("groupMembers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    const groupIds = userGroups.map(gm => gm.groupId)

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0]

    // Get all upcoming sessions for these groups
    const sessions = []
    for (const groupId of groupIds) {
      const groupSessions = await ctx.db
        .query("sessions")
        .withIndex("by_group", (q) => q.eq("groupId", groupId))
        .filter((q) => q.gte(q.field("date"), today))
        .collect()
      sessions.push(...groupSessions)
    }

    // Sort by date and time
    return sessions
      .sort((a, b) => {
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date)
        }
        return a.startTime.localeCompare(b.startTime)
      })
      .slice(0, 5) // Limit to 5 upcoming sessions
  },
})

export const getRecent = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // ... existing code ...
  }
})

export const getUpcomingByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split('T')[0]
    
    return await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("createdBy", args.userId))
      .filter((q) => q.gte(q.field("date"), today))
      .order("asc")
      .take(5)
  },
})

export const create = mutation({
  args: {
    groupId: v.id("groups"),
    title: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized")
    }

    // Verify the user is a member of the group
    const groupMember = await ctx.db
      .query("groupMembers")
      .withIndex("by_user", (q) => q.eq("userId", args.createdBy))
      .filter((q) => q.eq(q.field("groupId"), args.groupId))
      .first()

    if (!groupMember) {
      throw new Error("You must be a member of the group to create sessions")
    }

    const sessionId = await ctx.db.insert("sessions", {
      title: args.title,
      description: args.description,
      date: args.date,
      startTime: args.startTime,
      endTime: args.endTime,
      groupId: args.groupId,
      createdBy: args.createdBy,
    })

    // Add the creator as an attendee
    await ctx.db.insert("sessionAttendees", {
      sessionId,
      userId: args.createdBy,
    })

    return sessionId
  },
})

