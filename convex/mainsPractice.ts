import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { MAINS_SEED_QUESTIONS } from "./seed/mainsData";

function utcDay(ts: number): string {
  const d = new Date(ts);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function prevUtcDayFromToday(): string {
  return utcDay(Date.now() - 86400000);
}

function computeStreak(lastPracticeAt: number | undefined, streakDays: number | undefined): number {
  const today = utcDay(Date.now());
  const last = lastPracticeAt !== undefined ? utcDay(lastPracticeAt) : null;
  const streak = streakDays ?? 0;

  if (last === null) return 1;
  if (last === today) return streak;
  const yest = prevUtcDayFromToday();
  if (last === yest) return streak + 1;
  return 1;
}

export const listQuestionsForSubject = query({
  args: {
    locale: v.union(v.literal("en"), v.literal("hi")),
    subject: v.string(),
  },
  handler: async (_ctx, { locale, subject }) => {
    return MAINS_SEED_QUESTIONS.filter((q) => q.subject === subject).map((q) => ({
      key: q.key,
      subject: q.subject,
      maxMarks: q.maxMarks,
      text: locale === "hi" && q.textHi !== undefined && q.textHi.length > 0 ? q.textHi : q.textEn,
    }));
  },
});

export const recordMainsEval = mutation({
  args: {
    questionKey: v.string(),
    subject: v.string(),
    questionText: v.string(),
    answerText: v.string(),
    marksMax: v.number(),
    score: v.number(),
    feedbackJson: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in to save Mains scores to the leaderboard.");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found.");

    const now = Date.now();
    const score = Math.max(0, Math.min(args.marksMax, args.score));

    await ctx.db.insert("mainsSubmissions", {
      userId,
      questionId: args.questionKey,
      questionKey: args.questionKey,
      subject: args.subject,
      questionText: args.questionText,
      answerText: args.answerText,
      marksMax: args.marksMax,
      score,
      feedbackJson: args.feedbackJson,
      createdAt: now,
    });

    const newStreak = computeStreak(user.lastPracticeAt, user.streakDays);

    await ctx.db.patch(userId, {
      mainsMarksEarnedTotal: (user.mainsMarksEarnedTotal ?? 0) + score,
      mainsEvalCount: (user.mainsEvalCount ?? 0) + 1,
      lastPracticeAt: now,
      streakDays: newStreak,
    });

    return { score, marksMax: args.marksMax };
  },
});
