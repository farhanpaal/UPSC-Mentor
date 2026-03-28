"use client";

import { useLocale } from "@/contexts/locale-context";
import { landingCopy } from "@/lib/landing-copy";

export type AppPageKey = "practice" | "mains" | "dashboard" | "chat";

type Props = {
  pageKey: AppPageKey;
};

export function FeaturePage({ pageKey }: Props) {
  const { locale } = useLocale();
  const p = landingCopy[locale].pages[pageKey];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
        UPSCMENTOR
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        {p.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">{p.description}</p>
      {p.placeholder ? (
        <div className="glass-card mt-10 rounded-2xl p-8">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">{p.placeholder}</p>
        </div>
      ) : null}
    </main>
  );
}
