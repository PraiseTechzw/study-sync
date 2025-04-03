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
    // First, try to get the user by Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first()

    // If no user found, return null
    if (!user) return null

    // Get the identity after finding the user
    const identity = await ctx.auth.getUserIdentity()
    
    // If no identity but user exists, still return the user
    // This allows the profile to be accessed during server-side rendering
    if (!identity) return user

    // If we have both user and identity, verify they match
    if (user.clerkId !== identity.subject) {
      return null
    }

    return user
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    university: v.string(),
    major: v.string(),
    imageUrl: v.optional(v.string()),
    courses: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    console.log("Creating user with args:", args) // Debug log

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first()

    if (existingUser) {
      console.log("User already exists:", existingUser) // Debug log
      return existingUser._id
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      clerkId: args.clerkId,
      university: args.university,
      major: args.major,
      imageUrl: args.imageUrl,
      courses: args.courses || [],
    })

    console.log("Created new user with ID:", userId) // Debug log
    return userId
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

export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

