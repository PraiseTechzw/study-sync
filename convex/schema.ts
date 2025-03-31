import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    university: v.string(),
    major: v.string(),
    imageUrl: v.optional(v.string()),
    courses: v.optional(v.array(v.string())),
  })
    .index("by_email", ["email"])
    .index("by_clerk_id", ["clerkId"]),

  groups: defineTable({
    name: v.string(),
    course: v.string(),
    description: v.string(),
    createdBy: v.id("users"),
    isPublic: v.boolean(),
  })
    .index("by_course", ["course"])
    .index("by_creator", ["createdBy"]),

  groupMembers: defineTable({
    groupId: v.id("groups"),
    userId: v.id("users"),
  })
    .index("by_group", ["groupId"])
    .index("by_user", ["userId"]),

  sessions: defineTable({
    groupId: v.id("groups"),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    location: v.string(),
    topic: v.string(),
    description: v.optional(v.string()),
    createdBy: v.id("users"),
  })
    .index("by_group", ["groupId"])
    .index("by_date", ["date"])
    .index("by_creator", ["createdBy"]),

  sessionAttendees: defineTable({
    sessionId: v.id("sessions"),
    userId: v.id("users"),
  })
    .index("by_session", ["sessionId"])
    .index("by_user", ["userId"]),

  messages: defineTable({
    groupId: v.id("groups"),
    userId: v.id("users"),
    content: v.string(),
    timestamp: v.number(),
  })
    .index("by_group", ["groupId"])
    .index("by_user", ["userId"]),

  resources: defineTable({
    groupId: v.id("groups"),
    name: v.string(),
    type: v.string(),
    url: v.string(),
    uploadedBy: v.id("users"),
    uploadedAt: v.number(),
  })
    .index("by_group", ["groupId"])
    .index("by_uploader", ["uploadedBy"]),
})

