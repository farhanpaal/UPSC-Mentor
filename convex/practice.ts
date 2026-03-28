import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

/** Streak: +1 if last activity was yesterday; unchanged if already today; reset to 1 after a gap. */
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

const attemptValidator = v.object({
  questionId: v.string(),
  subject: v.string(),
  topic: v.optional(v.string()),
  year: v.optional(v.number()),
  correct: v.boolean(),
  timeMs: v.optional(v.number()),
});

/** Save a finished 10-Q, incorrect-review, or 60-Q session, per-question attempts, streak, and totals. */
export const completeMcqSession = mutation({
  args: {
    mode: v.union(v.literal("quick10"), v.literal("mock60"), v.literal("incorrect10")),
    subject: v.optional(v.string()),
    durationMs: v.number(),
    timeLimitMs: v.optional(v.number()),
    attempts: v.array(attemptValidator),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in to save your progress.");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found.");

    const now = Date.now();
    const correctCount = args.attempts.filter((a) => a.correct).length;
    const totalCount = args.attempts.length;

    for (const a of args.attempts) {
      await ctx.db.insert("mcqAttempts", {
        userId,
        questionId: a.questionId,
        subject: a.subject,
        topic: a.topic,
        year: a.year,
        correct: a.correct,
        timeMs: a.timeMs,
        createdAt: now,
        sessionMode: args.mode,
      });
    }

    await ctx.db.insert("mcqTestSessions", {
      userId,
      mode: args.mode,
      subject: args.subject,
      correctCount,
      totalCount,
      timeLimitMs: args.timeLimitMs,
      durationMs: args.durationMs,
      createdAt: now,
    });

    const newStreak = computeStreak(user.lastPracticeAt, user.streakDays);

    await ctx.db.patch(userId, {
      lastPracticeAt: now,
      streakDays: newStreak,
      mcqCorrectTotal: (user.mcqCorrectTotal ?? 0) + correctCount,
      mcqAttemptedTotal: (user.mcqAttemptedTotal ?? 0) + totalCount,
    });

    return { correctCount, totalCount, streakDays: newStreak };
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    username: v.optional(v.string()),
  },
  handler: async (ctx, { name, username }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated.");

    const patch: {
      name?: string;
      username?: string;
      usernameNormalized?: string;
    } = {};

    if (name !== undefined) {
      const t = name.trim();
      patch.name = t.length > 0 ? t : undefined;
    }

    if (username !== undefined && username.trim().length > 0) {
      const u = username.trim();
      if (u.length < 3 || u.length > 24) {
        throw new Error("Username must be 3–24 characters.");
      }
      if (!/^[a-zA-Z0-9_]+$/.test(u)) {
        throw new Error("Use only letters, numbers, and underscores.");
      }
      const norm = u.toLowerCase();
      patch.username = u;
      patch.usernameNormalized = norm;
    }

    if (Object.keys(patch).length === 0) {
      throw new Error("Nothing to update.");
    }

    await ctx.db.patch(userId, patch);
    return null;
  },
});

function idSuffix(convexId: string): string {
  const raw = convexId.replace(/^j/, "");
  return raw.length <= 4 ? raw : raw.slice(-4);
}

export const getLeaderboard = query({
  args: { search: v.optional(v.string()) },
  handler: async (ctx, { search }) => {
    const all = await ctx.db.query("users").collect();
    let list = all.filter((u) => u.usernameNormalized !== undefined && u.usernameNormalized.length > 0);
    list.sort((a, b) => {
      const mcqA = a.mcqCorrectTotal ?? 0;
      const mcqB = b.mcqCorrectTotal ?? 0;
      const mainsA = a.mainsMarksEarnedTotal ?? 0;
      const mainsB = b.mainsMarksEarnedTotal ?? 0;
      const totalA = mcqA + mainsA;
      const totalB = mcqB + mainsB;
      if (totalB !== totalA) return totalB - totalA;
      if (mcqB !== mcqA) return mcqB - mcqA;
      return (b.streakDays ?? 0) - (a.streakDays ?? 0);
    });

    if (search !== undefined && search.trim().length > 0) {
      const s = search.trim().toLowerCase();
      list = list.filter(
        (u) =>
          (u.username ?? "").toLowerCase().includes(s) ||
          (u.name ?? "").toLowerCase().includes(s),
      );
    }

    return list.slice(0, 100).map((u, i) => {
      const mcq = u.mcqCorrectTotal ?? 0;
      const mains = u.mainsMarksEarnedTotal ?? 0;
      return {
        rank: i + 1,
        userId: u._id,
        idSuffix: idSuffix(u._id),
        username: u.username ?? "",
        name: u.name,
        correct: mcq,
        attempted: u.mcqAttemptedTotal ?? 0,
        streakDays: u.streakDays ?? 0,
        mainsMarks: mains,
        totalScore: mcq + mains,
      };
    });
  },
});

/** Question IDs where the user’s latest attempt is incorrect (for “wrong last time” review). */
export const getIncorrectQuestionIds = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return { ids: [] as string[] };

    const attempts = await ctx.db
      .query("mcqAttempts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    attempts.sort((a, b) => b.createdAt - a.createdAt);
    const latest = new Map<string, boolean>();
    for (const a of attempts) {
      if (!latest.has(a.questionId)) {
        latest.set(a.questionId, a.correct);
      }
    }
    const ids: string[] = [];
    for (const [qid, ok] of latest) {
      if (!ok) ids.push(qid);
    }
    return { ids };
  },
});

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;

    const user = await ctx.db.get(userId);
    if (user === null) return null;

    const sessions = (
      await ctx.db
        .query("mcqTestSessions")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect()
    )
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 20);

    const attempts = await ctx.db
      .query("mcqAttempts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const bySubject: Record<string, { correct: number; total: number }> = {};
    for (const a of attempts) {
      const k = a.subject;
      if (bySubject[k] === undefined) {
        bySubject[k] = { correct: 0, total: 0 };
      }
      bySubject[k].total += 1;
      if (a.correct) bySubject[k].correct += 1;
    }

    const weeklyTrend: number[] = [];
    for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
      const key = utcDay(Date.now() - daysAgo * 86400000);
      const dayAttempts = attempts.filter((a) => utcDay(a.createdAt) === key);
      weeklyTrend.push(
        dayAttempts.length === 0
          ? 0
          : Math.round(
              (dayAttempts.filter((x) => x.correct).length / dayAttempts.length) * 100,
            ),
      );
    }

    const weakSubjects = Object.entries(bySubject)
      .filter(([, v]) => v.total >= 2)
      .map(([subject, v]) => ({
        subject,
        pct: Math.round((v.correct / v.total) * 100),
      }))
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 4);

    const readiness =
      attempts.length === 0
        ? 0
        : Math.round((attempts.filter((x) => x.correct).length / attempts.length) * 100);

    return {
      user,
      sessions,
      bySubject,
      weeklyTrend,
      weakSubjects,
      readiness,
      totalAttempts: attempts.length,
    };
  },
});
