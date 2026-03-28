import { v } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
} from "./_generated/server";
import { PRELIMS_BANK_EN, PRELIMS_BANK_HI } from "./seed/prelimsData";

const prelimsItemValidator = v.object({
  ingestKey: v.string(),
  locale: v.union(v.literal("en"), v.literal("hi")),
  subject: v.string(),
  topic: v.optional(v.string()),
  year: v.number(),
  question: v.string(),
  options: v.array(v.string()),
  correctIndex: v.number(),
  explanation: v.string(),
});

function assertValidMcqShape(options: string[], correctIndex: number) {
  if (options.length !== 4) {
    throw new Error("Each MCQ must have exactly 4 options.");
  }
  if (correctIndex < 0 || correctIndex > 3 || !Number.isInteger(correctIndex)) {
    throw new Error("correctIndex must be 0, 1, 2, or 3.");
  }
}

async function upsertPrelims(
  ctx: MutationCtx,
  item: {
    ingestKey: string;
    locale: "en" | "hi";
    subject: string;
    topic?: string;
    year: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  },
  updatedAt: number,
) {
  assertValidMcqShape(item.options, item.correctIndex);
  const existing = await ctx.db
    .query("prelimsPyqs")
    .withIndex("by_ingestKey", (q) => q.eq("ingestKey", item.ingestKey))
    .first();

  const doc = {
    ingestKey: item.ingestKey,
    locale: item.locale,
    subject: item.subject,
    topic: item.topic,
    year: item.year,
    question: item.question,
    options: item.options,
    correctIndex: item.correctIndex,
    explanation: item.explanation,
    updatedAt,
  };

  if (existing) {
    await ctx.db.patch(existing._id, doc);
    return "updated" as const;
  }
  await ctx.db.insert("prelimsPyqs", doc);
  return "inserted" as const;
}

/** Practice page: all MCQs for a locale (filter client-side for snappy UX at modest bank sizes). */
export const listForPractice = query({
  args: { locale: v.union(v.literal("en"), v.literal("hi")) },
  handler: async (ctx, { locale }) => {
    return await ctx.db
      .query("prelimsPyqs")
      .withIndex("by_locale", (q) => q.eq("locale", locale))
      .collect();
  },
});

/** Idempotent seed from built-in bank. Safe to run multiple times. */
export const seedBuiltIn = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    let inserted = 0;
    let updated = 0;
    for (const q of PRELIMS_BANK_EN) {
      const r = await upsertPrelims(
        ctx,
        {
          ingestKey: `seed:${q.id}`,
          locale: "en",
          subject: q.subject,
          topic: q.topic,
          year: q.year,
          question: q.question,
          options: [...q.options],
          correctIndex: q.correctIndex,
          explanation: q.explanation,
        },
        now,
      );
      if (r === "inserted") inserted += 1;
      else updated += 1;
    }
    for (const q of PRELIMS_BANK_HI) {
      const r = await upsertPrelims(
        ctx,
        {
          ingestKey: `seed:${q.id}`,
          locale: "hi",
          subject: q.subject,
          topic: q.topic,
          year: q.year,
          question: q.question,
          options: [...q.options],
          correctIndex: q.correctIndex,
          explanation: q.explanation,
        },
        now,
      );
      if (r === "inserted") inserted += 1;
      else updated += 1;
    }
    return { inserted, updated, total: inserted + updated };
  },
});

/** Called from HTTP ingest (Apify). Uses stable `ingestKey` per row for upserts. */
export const ingestBatch = internalMutation({
  args: { items: v.array(prelimsItemValidator) },
  handler: async (ctx, { items }) => {
    const now = Date.now();
    let inserted = 0;
    let updated = 0;
    for (const item of items) {
      const r = await upsertPrelims(ctx, item, now);
      if (r === "inserted") inserted += 1;
      else updated += 1;
    }
    return { inserted, updated, processed: items.length };
  },
});
