import { ConvexError } from "convex/values"
import { DatabaseReader, Auth } from "./_generated/server"

export const getUserIdentity = async (ctx: { auth: Auth, db: DatabaseReader }) => {
  if (!ctx.auth?.userId) {
    throw new ConvexError("Unauthorized")
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", ctx.auth.userId))
    .first()

  if (!user) {
    throw new ConvexError("User not found")
  }

  return user._id
} 