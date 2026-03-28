"use client";

import { useLocale } from "@/contexts/locale-context";
import { landingCopy } from "@/lib/landing-copy";
import { api } from "@convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, AuthLoading, Unauthenticated, useQuery } from "convex/react";
import Link from "next/link";

function hasConvexUrl() {
  return (
    typeof process.env.NEXT_PUBLIC_CONVEX_URL === "string" && process.env.NEXT_PUBLIC_CONVEX_URL.length > 0
  );
}

export function HeaderAuth() {
  const { locale } = useLocale();
  const copy = landingCopy[locale];

  if (!hasConvexUrl()) {
    return (
      <Link
        href="/sign-in"
        className="inline-flex shrink-0 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:brightness-110 sm:text-sm"
      >
        {copy.signIn}
      </Link>
    );
  }

  return (
    <>
      <AuthLoading>
        <span className="inline-block h-9 min-w-[4.5rem] shrink-0 animate-pulse rounded-full bg-white/10 sm:min-w-[5.5rem]" />
      </AuthLoading>
      <Unauthenticated>
        <Link
          href="/sign-in"
          className="inline-flex shrink-0 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:brightness-110 sm:text-sm"
        >
          {copy.signIn}
        </Link>
      </Unauthenticated>
      <Authenticated>
        <SignedInMenu />
      </Authenticated>
    </>
  );
}

function SignedInMenu() {
  const { locale } = useLocale();
  const copy = landingCopy[locale];
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.viewer);

  const label =
    user === undefined ? copy.auth.loading : (user?.name ?? user?.email ?? copy.auth.loading);
  const handle = user?.username;

  return (
    <div className="flex max-w-[min(100vw,200px)] items-center gap-1.5 sm:max-w-none sm:gap-2">
      <span
        className="max-w-[160px] truncate text-xs font-medium text-zinc-600 dark:text-zinc-300"
        title={handle ? `${label} (@${handle})` : label}
      >
        {handle ? (
          <>
            <span className="text-zinc-500">@</span>
            {handle}
          </>
        ) : (
          label
        )}
      </span>
      <button
        type="button"
        onClick={() => void signOut()}
        className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-white/10 dark:text-zinc-200"
      >
        {copy.auth.signOut}
      </button>
    </div>
  );
}
