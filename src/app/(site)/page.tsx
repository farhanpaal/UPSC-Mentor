"use client";

import { useLocale } from "@/contexts/locale-context";
import { landingCopy } from "@/lib/landing-copy";
import Link from "next/link";

export default function HomePage() {
  const { locale } = useLocale();
  const c = landingCopy[locale];

  return (
    <main className="relative z-10 flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-12 pt-12 sm:px-6 sm:pt-16 md:flex-row md:items-center md:gap-16">
        <div className="flex-1 space-y-6">
          <p className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
            {c.hero.badge}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] tracking-tight text-zinc-900 dark:text-white sm:text-5xl md:text-6xl">
            {c.hero.title}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">{c.hero.subtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/practice"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110"
            >
              {c.hero.ctaPrimary}
            </Link>
            <Link
              href="/#features"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-800 backdrop-blur transition hover:bg-white/10 dark:text-zinc-100"
            >
              {c.hero.ctaSecondary}
            </Link>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <Link href="/dashboard" className="glass-card block rounded-2xl p-6 transition hover:border-white/25">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Readiness
            </p>
            <div className="mt-4 flex items-end gap-2">
              <span className="font-[family-name:var(--font-display)] text-5xl font-bold text-zinc-900 dark:text-white">
                72
              </span>
              <span className="mb-1 text-sm text-zinc-500">/ 100 Prelims</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400" />
            </div>
          </Link>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/practice" className="glass-card block rounded-2xl p-5 transition hover:border-white/25">
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">1.2k+</p>
              <p className="mt-1 text-xs text-zinc-500">PYQs indexed</p>
            </Link>
            <Link href="/mains" className="glass-card block rounded-2xl p-5 transition hover:border-white/25">
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">Evaluate </p>
              <p className="mt-1 text-xs text-zinc-500">Sub-second eval</p>
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-white/10 bg-black/[0.02] py-20 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            {c.features.title}
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {c.features.items.map((item) => (
              <article
                key={item.title}
                className="glass-card group rounded-2xl p-6 transition duration-300 hover:-translate-y-0.5 hover:border-indigo-400/30 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="mb-3 h-1 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-80 transition group-hover:w-14" />
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="glass-card flex flex-col gap-6 rounded-3xl p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-zinc-900 dark:text-white">
                {c.bonus.title}
              </h2>
              <ul className="mt-4 grid gap-2 text-sm text-zinc-600 dark:text-zinc-400 sm:grid-cols-2">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {c.bonus.ca}
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {c.bonus.analyzer}
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {c.bonus.prompts}
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {c.bonus.offline}
                </li>
                <li className="flex items-center gap-2 sm:col-span-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {c.bonus.lang}
                </li>
              </ul>
            </div>
            <div className="shrink-0 rounded-2xl border border-dashed border-white/20 bg-white/5 px-6 py-8 text-center">
              <p className="text-sm font-medium text-zinc-500">Stack</p>
              <p className="mt-2 font-mono text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                Cursor · Convex · Groq
                <br />
                Apify · Exa · Next.js
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
