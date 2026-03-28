"use client";

import { SignInForm, GoogleSignIn } from "./sign-in-form";
import { useLocale } from "@/contexts/locale-context";
import { landingCopy } from "@/lib/landing-copy";
import Link from "next/link";

function hasConvexUrl() {
  return (
    typeof process.env.NEXT_PUBLIC_CONVEX_URL === "string" && process.env.NEXT_PUBLIC_CONVEX_URL.length > 0
  );
}

export function SignInClient() {
  const { locale } = useLocale();
  const a = landingCopy[locale].auth;

  if (!hasConvexUrl()) {
    return (
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-16 sm:px-6">
        <div className="glass-card rounded-3xl p-8">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-zinc-900 dark:text-white">
            {a.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{a.configureConvex}</p>
          <Link
            href="/"
            className="mt-8 inline-flex text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            ← Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-16 sm:px-6">
      <div className="glass-card rounded-3xl p-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-zinc-900 dark:text-white">
          {a.title}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{a.subtitle}</p>
        <SignInForm />
        <GoogleSignIn />
        <p className="mt-8 text-center text-sm text-zinc-500">
          <Link href="/" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
