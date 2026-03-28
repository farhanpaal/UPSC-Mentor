"use client";

import { useLocale } from "@/contexts/locale-context";
import { landingCopy } from "@/lib/landing-copy";
import { Unauthenticated } from "convex/react";
import Link from "next/link";

function hasConvexUrl() {
  return (
    typeof process.env.NEXT_PUBLIC_CONVEX_URL === "string" &&
    process.env.NEXT_PUBLIC_CONVEX_URL.length > 0
  );
}

export function AuthBanner() {
  const { locale } = useLocale();
  const b = landingCopy[locale].authBanner;

  if (!hasConvexUrl()) return null;

  return (
    <Unauthenticated>
      <div className="relative z-20 border-b border-indigo-500/20 bg-gradient-to-r from-indigo-600/15 via-violet-600/10 to-transparent px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">{b.title}</p>
            <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">{b.body}</p>
          </div>
          <Link
            href="/sign-in"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-zinc-900 px-5 py-2 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900"
          >
            {b.cta}
          </Link>
        </div>
      </div>
    </Unauthenticated>
  );
}
