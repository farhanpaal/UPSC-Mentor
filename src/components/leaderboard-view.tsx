"use client";

import { useLocale } from "@/contexts/locale-context";
import { landingCopy } from "@/lib/landing-copy";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";

export function LeaderboardView() {
  const { locale } = useLocale();
  const p = landingCopy[locale].pages.leaderboard;
  const L = landingCopy[locale].leaderboardUi;
  const [search, setSearch] = useState("");

  const rows = useQuery(api.practice.getLeaderboard, {
    search: search.trim().length > 0 ? search.trim() : undefined,
  });

  const displayRows = useMemo(() => rows ?? [], [rows]);

  const duplicateUsernames = useMemo(() => {
    const c = new Map<string, number>();
    for (const r of displayRows) {
      const k = r.username.toLowerCase();
      c.set(k, (c.get(k) ?? 0) + 1);
    }
    return c;
  }, [displayRows]);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
        UPSCMENTOR
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        {p.title}
      </h1>
      <p className="mt-3 max-w-2xl text-base text-zinc-600 dark:text-zinc-400">{p.description}</p>

      <div className="mt-8">
        <label className="sr-only" htmlFor="lb-search">
          Search
        </label>
        <input
          id="lb-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={L.searchPlaceholder}
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-zinc-900 outline-none ring-indigo-500/30 placeholder:text-zinc-500 focus:ring-2 dark:text-white"
        />
      </div>

      <div className="glass-card mt-6 overflow-hidden rounded-2xl">
        {rows === undefined ? (
          <p className="p-8 text-center text-sm text-zinc-500">{L.loading}</p>
        ) : displayRows.length === 0 ? (
          <p className="p-8 text-center text-sm text-zinc-500">{L.empty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  <th className="px-4 py-3">{L.rank}</th>
                  <th className="px-4 py-3">{L.user}</th>
                  <th className="px-4 py-3 text-right">{L.correct}</th>
                  <th className="px-4 py-3 text-right">{L.mains}</th>
                  <th className="px-4 py-3 text-right">{L.total}</th>
                  <th className="px-4 py-3 text-right">{L.attempted}</th>
                  <th className="px-4 py-3 text-right">{L.streak}</th>
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row) => {
                  const showSuffix = (duplicateUsernames.get(row.username.toLowerCase()) ?? 0) > 1;
                  return (
                    <tr
                      key={row.userId}
                      className="border-b border-white/5 transition hover:bg-white/[0.03]"
                    >
                      <td className="px-4 py-3 font-mono text-zinc-500">#{row.rank}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-zinc-900 dark:text-white">
                          @{row.username}
                          {showSuffix ? (
                            <span className="ml-1 font-mono text-xs font-normal text-zinc-500">·{row.idSuffix}</span>
                          ) : null}
                        </p>
                        {row.name ? <p className="text-xs text-zinc-500">{row.name}</p> : null}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                        {row.correct}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-violet-600 dark:text-violet-400">
                        {Math.round(row.mainsMarks * 10) / 10}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-zinc-900 dark:text-white">
                        {Math.round(row.totalScore * 10) / 10}
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">{row.attempted}</td>
                      <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400">{row.streakDays}d</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
