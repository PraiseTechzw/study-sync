import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect()
  },
})

export const get = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()
  },
})

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first()
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    university: v.string(),
    major: v.string(),
    imageUrl: v.optional(v.string()),
    courses: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized")
    }

    const clerkId = identity.subject

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first()

    if (existingUser) {
      return existingUser._id
    }

    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      clerkId,
      university: args.university,
      major: args.major,
      imageUrl: args.imageUrl,
      courses: args.courses || [],
    })
  },
})

export const update = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    university: v.optional(v.string()),
    major: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    courses: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized")
    }

    const { id, ...updates } = args
    const user = await ctx.db.get(id)

    if (!user) {
      throw new Error("User not found")
    }

    if (user.clerkId !== identity.subject) {
      throw new Error("Unauthorized")
    }

    return await ctx.db.patch(id, updates)
  },
})

