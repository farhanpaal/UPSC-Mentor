"use client";

import { useLocale } from "@/contexts/locale-context";
import { landingCopy } from "@/lib/landing-copy";
import { api } from "@convex/_generated/api";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useEffect, useState } from "react";

function hasConvexUrl() {
  return (
    typeof process.env.NEXT_PUBLIC_CONVEX_URL === "string" &&
    process.env.NEXT_PUBLIC_CONVEX_URL.length > 0
  );
}

export function DashboardView() {
  const { locale } = useLocale();
  const p = landingCopy[locale].pages.dashboard;
  const d = landingCopy[locale].dashboardUi;
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const stats = useQuery(api.practice.getDashboardStats, isAuthenticated ? {} : "skip");
  const updateProfile = useMutation(api.practice.updateProfile);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profileStatus, setProfileStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (stats?.user) {
      setName(stats.user.name ?? "");
      setUsername(stats.user.username ?? "");
    }
  }, [stats?.user]);

  if (!hasConvexUrl()) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-zinc-600 dark:text-zinc-400">{landingCopy[locale].auth.configureConvex}</p>
      </main>
    );
  }

  if (authLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-16 h-48 animate-pulse rounded-2xl bg-white/5" />;
  }

  if (!isAuthenticated) {
    return (
      <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{p.title}</h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">{d.signInForDashboard}</p>
        <Link
          href="/sign-in"
          className="mt-8 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3 text-sm font-semibold text-white"
        >
          {landingCopy[locale].signIn}
        </Link>
      </main>
    );
  }

  const readiness = stats?.readiness ?? 0;
  const weekly = stats?.weeklyTrend ?? [0, 0, 0, 0, 0, 0, 0];
  const maxBar = Math.max(...weekly, 1);
  const weekLabels = ["-6d", "-5d", "-4d", "-3d", "-2d", "-1d", "Today"];

  const subjectRows = d.subjects.map((label, i) => {
    const keyEn = landingCopy.en.dashboardUi.subjects[i];
    const bucket = keyEn && stats?.bySubject ? stats.bySubject[keyEn] : undefined;
    const pct =
      bucket && bucket.total > 0 ? Math.round((bucket.correct / bucket.total) * 100) : 0;
    const hasData = bucket && bucket.total > 0;
    return { label, pct, hasData };
  });

  async function onSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileStatus("saving");
    setProfileError(null);
    const u = username.trim();
    const n = name.trim();
    if (u.length > 0 && u.length < 3) {
      setProfileStatus("error");
      setProfileError("Username must be at least 3 characters.");
      return;
    }
    try {
      await updateProfile({
        name: n.length > 0 ? n : undefined,
        username: u.length > 0 ? u : undefined,
      });
      setProfileStatus("saved");
      setTimeout(() => setProfileStatus("idle"), 2000);
    } catch (err) {
      setProfileStatus("error");
      setProfileError(err instanceof Error ? err.message : "Failed to save");
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
        UPSCMENTOR
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        {p.title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">{p.description}</p>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{d.sampleNote}</p>

      <section className="glass-card mt-10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">{d.profileTitle}</h2>
        <p className="mt-1 text-xs text-zinc-500">{d.profileHint}</p>
        <form onSubmit={onSaveProfile} className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-zinc-800 dark:text-zinc-200">{d.displayName}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-zinc-900 dark:text-white"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-zinc-800 dark:text-zinc-200">{d.username}</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              maxLength={24}
              pattern="[a-zA-Z0-9_]*"
              placeholder="e.g. priya_ias"
              className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-zinc-900 dark:text-white"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={profileStatus === "saving"}
              className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {profileStatus === "saving" ? d.saving : d.saveProfile}
            </button>
            {profileStatus === "saved" ? (
              <span className="text-sm text-emerald-600 dark:text-emerald-400">{d.saved}</span>
            ) : null}
            {profileError ? (
              <span className="text-sm text-red-600 dark:text-red-400">{profileError}</span>
            ) : null}
          </div>
        </form>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-6 lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{d.readiness}</p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-5xl font-bold text-zinc-900 dark:text-white">
            {stats === undefined ? "—" : readiness}
            <span className="text-lg font-medium text-zinc-500">/100</span>
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all"
              style={{ width: `${Math.min(100, readiness)}%` }}
            />
          </div>
          <p className="mt-4 text-sm text-zinc-500">
            {d.streakLabel}:{" "}
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {stats?.user?.streakDays ?? 0}d
            </span>
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{d.weeklyTrend}</p>
          <div className="mt-6 flex h-40 items-end gap-2 sm:gap-3">
            {weekly.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end justify-center">
                  <div
                    className="w-full max-w-[3rem] rounded-t-md bg-gradient-to-t from-indigo-600/90 to-violet-500/80 transition hover:opacity-90"
                    style={{ height: `${Math.max(8, (v / maxBar) * 100)}%` }}
                    title={`${v}%`}
                  />
                </div>
                <span className="text-[10px] font-medium text-zinc-500 sm:text-xs">{weekLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{d.heatmapTitle}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {subjectRows.map(({ label, pct, hasData }) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 px-3 py-3 text-center"
                style={{
                  background: hasData
                    ? `rgba(99, 102, 241, ${0.12 + (pct / 100) * 0.38})`
                    : "rgba(99, 102, 241, 0.06)",
                }}
              >
                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-100">{label}</p>
                <p className="mt-1 text-lg font-semibold text-indigo-700 dark:text-indigo-200">
                  {hasData ? `${pct}%` : "—"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{d.recommendationsTitle}</p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {stats?.weakSubjects && stats.weakSubjects.length > 0 ? (
              stats.weakSubjects.map((w) => (
                <li key={w.subject} className="flex gap-2">
                  <span className="text-amber-500">●</span>
                  {locale === "hi" ? (
                    <span>
                      <strong>{w.subject}</strong> में सटीकता {w.pct}% — अतिरिक्त अभ्यास करें।
                    </span>
                  ) : (
                    <span>
                      Prioritize <strong>{w.subject}</strong> — accuracy {w.pct}% so far.
                    </span>
                  )}
                </li>
              ))
            ) : (
              <li className="flex gap-2 text-zinc-500">
                <span className="text-emerald-500">●</span>
                {locale === "hi"
                  ? "अधिक टेस्ट पूरे करने पर कमजोर विषय यहाँ दिखेंगे।"
                  : "Complete more subject tests to surface focus areas here."}
              </li>
            )}
          </ul>
          <p className="mt-4 text-xs text-zinc-500">{d.weakTitle}</p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {stats?.weakSubjects?.[0]?.subject ??
              (locale === "hi" ? "अभी डेटा कम है" : "Keep practicing")}
          </p>
        </div>
      </div>

      <section className="glass-card mt-6 rounded-2xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">{d.historyTitle}</h2>
        {stats === undefined || stats === null ? (
          <p className="mt-4 text-sm text-zinc-500">…</p>
        ) : stats.sessions.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">{d.noHistory}</p>
        ) : (
          <ul className="mt-4 divide-y divide-white/10">
            {stats.sessions.map((s) => (
              <li key={s._id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-200">
                    {s.mode === "quick10"
                      ? d.historyQuick
                      : s.mode === "incorrect10"
                        ? d.historyIncorrect
                        : d.historyMock}
                  </span>
                  {s.subject ? (
                    <span className="ml-2 text-zinc-600 dark:text-zinc-400">{s.subject}</span>
                  ) : null}
                </div>
                <div className="font-medium text-zinc-900 dark:text-white">
                  {s.correctCount}/{s.totalCount}{" "}
                  <span className="text-zinc-500">
                    ({Math.round((s.correctCount / Math.max(1, s.totalCount)) * 100)}%)
                  </span>
                </div>
                <div className="w-full text-xs text-zinc-500 sm:w-auto">
                  {new Date(s.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled
          className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-400"
          title={d.exportSoon}
        >
          {d.exportPdf} — {d.exportSoon}
        </button>
      </div>
    </main>
  );
}
