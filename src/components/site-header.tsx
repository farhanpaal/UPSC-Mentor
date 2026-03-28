"use client";

import { useLocale } from "@/contexts/locale-context";
import { landingCopy } from "@/lib/landing-copy";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderAuth } from "./header-auth";
import { ThemeToggle } from "./theme-toggle";

const NAV_PATHS = [
  { path: "/practice", key: "mcq" as const },
  { path: "/mains", key: "mains" as const },
  { path: "/dashboard", key: "dashboard" as const },
  { path: "/leaderboard", key: "leaderboard" as const },
  { path: "/chat", key: "chat" as const },
];

function HeaderControls() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
      <div className="flex rounded-full border border-zinc-200/80 bg-white/60 p-0.5 dark:border-white/15 dark:bg-white/5">
        <button
          type="button"
          onClick={() => setLocale("en")}
          className={`rounded-full px-2 py-1 text-xs font-semibold transition sm:px-2.5 ${
            locale === "en"
              ? "bg-zinc-900 text-white shadow dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLocale("hi")}
          className={`rounded-full px-2 py-1 text-xs font-semibold transition sm:px-2.5 ${
            locale === "hi"
              ? "bg-zinc-900 text-white shadow dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          हि
        </button>
      </div>
      <ThemeToggle />
      <HeaderAuth />
    </div>
  );
}

export function SiteHeader() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const t = landingCopy[locale].nav;
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-[var(--surface)]/90 backdrop-blur-xl dark:border-white/10">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-x-2 gap-y-2 px-3 py-3 sm:px-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-4">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2 touch-manipulation justify-self-start"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition group-hover:shadow-indigo-500/40">
            U
          </span>
          <span className="truncate font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-lg">
            UPSCMENTOR
          </span>
        </Link>

        <div className="justify-self-end md:col-start-3 md:row-start-1">
          <HeaderControls />
        </div>

        <nav
          className="col-span-2 -mx-1 flex gap-0.5 overflow-x-auto pb-0.5 [-webkit-overflow-scrolling:touch] md:col-span-1 md:col-start-2 md:row-start-1 md:justify-center md:overflow-x-visible md:px-2"
          aria-label="Primary"
        >
          {NAV_PATHS.map(({ path, key }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                className={`shrink-0 touch-manipulation whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition sm:px-3.5 sm:text-sm ${
                  active
                    ? "bg-zinc-900/10 text-zinc-900 dark:bg-white/10 dark:text-white"
                    : "text-zinc-600 hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
                }`}
              >
                {t[key]}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
