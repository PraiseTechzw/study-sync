import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("groups")
      .filter((q) => q.eq(q.field("isPublic"), true))
      .collect()
  },
})

export const get = query({
  args: { id: v.id("groups") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const getForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query("groupMembers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    const groupIds = memberships.map(m => m.groupId)
    const groups = []
    for (const groupId of groupIds) {
      const group = await ctx.db.get(groupId)
      if (group) groups.push(group)
    }
    return groups
  },
})

export const getByCourse = query({
  args: { course: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("groups")
      .withIndex("by_course", (q) => q.eq("course", args.course))
      .collect()
  },
})

export const getRecommended = query({
  args: { userId: v.id("users"), limit: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)
    if (!user) return []

    // Get groups the user is already a member of
    const memberships = await ctx.db
      .query("groupMembers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    const userGroupIds = memberships.map(m => m.groupId)

    // Find public groups for the user's courses that they're not already in
    const recommendedGroups = []

    if (user.courses && user.courses.length > 0) {
      for (const course of user.courses) {
        const courseGroups = await ctx.db
          .query("groups")
          .withIndex("by_course", (q) => q.eq("course", course))
          .filter((q) => q.eq(q.field("isPublic"), true))
          .collect()

        // Filter out groups the user is already in
        const filteredGroups = courseGroups.filter((group) => !userGroupIds.includes(group._id))
        recommendedGroups.push(...filteredGroups)

        if (recommendedGroups.length >= args.limit) break
      }
    }

    // If we don't have enough recommendations, add some popular public groups
    if (recommendedGroups.length < args.limit) {
      const popularGroups = await ctx.db
        .query("groups")
        .filter((q) => q.eq(q.field("isPublic"), true))
        .collect()

      // Get member counts for each group
      const groupMemberCounts = await Promise.all(
        popularGroups.map(async (group) => {
          const count = await ctx.db
            .query("groupMembers")
            .withIndex("by_group", (q) => q.eq("groupId", group._id))
            .collect()
          return { group, count: count.length }
        })
      )

      // Sort by number of members (descending)
      groupMemberCounts.sort((a, b) => b.count - a.count)

      // Filter out groups the user is already in and ones already recommended
      const recommendedIds = recommendedGroups.map((group) => group._id)
      const additionalGroups = groupMemberCounts
        .filter(({ group }) => !userGroupIds.includes(group._id) && !recommendedIds.includes(group._id))
        .map(({ group }) => group)

      recommendedGroups.push(...additionalGroups)
    }

    return recommendedGroups.slice(0, args.limit)
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    course: v.string(),
    description: v.string(),
    createdBy: v.string(),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Unauthorized")

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.createdBy))
      .first()

    if (!user) throw new Error("User not found")

    const groupId = await ctx.db.insert("groups", {
      name: args.name,
      course: args.course,
      description: args.description,
      createdBy: user._id,
      isPublic: args.isPublic,
    })

    // Add creator as a member
    await ctx.db.insert("groupMembers", {
      groupId,
      userId: user._id,
    })

    return groupId
  },
})

export const join = mutation({
  args: {
    groupId: v.id("groups"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Unauthorized")

    const group = await ctx.db.get(args.groupId)
    if (!group) throw new Error("Group not found")

    // Check if user is already a member
    const existingMembership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first()

    if (existingMembership) return group._id

    // Add user as a member
    await ctx.db.insert("groupMembers", {
      groupId: args.groupId,
      userId: args.userId,
    })

    return group._id
  },
})

export const leave = mutation({
  args: {
    groupId: v.id("groups"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Unauthorized")

    const group = await ctx.db.get(args.groupId)
    if (!group) throw new Error("Group not found")

    // Check if user is a member
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first()

    if (!membership) return group._id

    // Remove user's membership
    await ctx.db.delete(membership._id)

    return group._id
  },
})

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("groups")
      .filter((q) => q.eq(q.field("members"), args.userId))
      .collect()
  },
})

