import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    /** Public handle for leaderboard search (display). */
    username: v.optional(v.string()),
    /** Lowercase copy for search; not unique — multiple users may share a display handle. */
    usernameNormalized: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    locale: v.optional(v.union(v.literal("en"), v.literal("hi"))),
    streakDays: v.optional(v.number()),
    lastPracticeAt: v.optional(v.number()),
    xp: v.optional(v.number()),
    /** Denormalized MCQ totals for leaderboard (incremented on each completed session). */
    mcqCorrectTotal: v.optional(v.number()),
    mcqAttemptedTotal: v.optional(v.number()),
    /** Sum of Mains evaluation scores (marks awarded) for leaderboard. */
    mainsMarksEarnedTotal: v.optional(v.number()),
    mainsEvalCount: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"])
    .index("by_username_normalized", ["usernameNormalized"]),

  mcqAttempts: defineTable({
    userId: v.id("users"),
    questionId: v.string(),
    subject: v.string(),
    topic: v.optional(v.string()),
    year: v.optional(v.number()),
    correct: v.boolean(),
    timeMs: v.optional(v.number()),
    createdAt: v.number(),
    sessionMode: v.optional(
      v.union(v.literal("quick10"), v.literal("mock60"), v.literal("incorrect10")),
    ),
  })
    .index("by_user", ["userId"])
    .index("by_user_subject", ["userId", "subject"]),

  /** One row per finished quick test or timed mock. */
  mcqTestSessions: defineTable({
    userId: v.id("users"),
    mode: v.union(v.literal("quick10"), v.literal("mock60"), v.literal("incorrect10")),
    subject: v.optional(v.string()),
    correctCount: v.number(),
    totalCount: v.number(),
    timeLimitMs: v.optional(v.number()),
    durationMs: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  mainsSubmissions: defineTable({
    userId: v.id("users"),
    questionId: v.string(),
    /** Stable key from mains question bank (e.g. en-polity-1). */
    questionKey: v.optional(v.string()),
    subject: v.optional(v.string()),
    questionText: v.string(),
    answerText: v.string(),
    marksMax: v.number(),
    feedbackJson: v.optional(v.string()),
    score: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  chatMessages: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    sourceUrls: v.optional(v.array(v.string())),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  /** Prelims MCQs: seed from `prelimsPyqs.seedBuiltIn`; bulk-ingest from Apify using `ingestKey` for idempotency. */
  prelimsPyqs: defineTable({
    ingestKey: v.string(),
    locale: v.union(v.literal("en"), v.literal("hi")),
    subject: v.string(),
    topic: v.optional(v.string()),
    year: v.number(),
    question: v.string(),
    options: v.array(v.string()),
    correctIndex: v.number(),
    explanation: v.string(),
    updatedAt: v.number(),
  })
    .index("by_ingestKey", ["ingestKey"])
    .index("by_locale", ["locale"])
    .index("by_locale_subject", ["locale", "subject"])
    .index("by_locale_year", ["locale", "year"]),
});
