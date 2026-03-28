"use client";

import { useLocale } from "@/contexts/locale-context";
import { landingCopy } from "@/lib/landing-copy";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignInForm() {
  const { locale } = useLocale();
  const a = landingCopy[locale].auth;
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="mt-8 flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        setPending(true);
        const form = event.currentTarget;
        const formData = new FormData(form);
        const emailRaw = String(formData.get("email") ?? "").trim().toLowerCase();
        formData.set("email", emailRaw);
        void signIn("password", formData)
          .then((result) => {
            if (result.signingIn) {
              router.replace("/");
              router.refresh();
              return;
            }
            if (result.redirect !== undefined) {
              return;
            }
            setError(
              step === "signUp"
                ? locale === "hi"
                  ? "खाता नहीं बन सका। ईमेल जाँचें या बाद में पुनः प्रयास करें।"
                  : "Could not finish sign-up. Check your email or try again."
                : locale === "hi"
                  ? "साइन इन पूरा नहीं हुआ। पुनः प्रयास करें।"
                  : "Sign-in did not complete. Please try again.",
            );
          })
          .catch((err: unknown) => {
            const message = err instanceof Error ? err.message : String(err);
            if (message === "InvalidAccountId" || message.includes("InvalidAccountId")) {
              setError(
                step === "signIn"
                  ? locale === "hi"
                    ? "इस ईमेल पर कोई खाता नहीं। पहले “खाता बनाएँ” से साइन अप करें।"
                    : "No account for this email. Use “Need an account? Sign up” first."
                  : locale === "hi"
                    ? "खाता नहीं बन सका। पहले से खाता है तो साइन इन करें; नहीं तो फिर कोशिश करें।"
                    : "Could not create an account. If you already registered, use Sign in; otherwise try again.",
              );
              return;
            }
            if (message.includes("already exists")) {
              setError(
                locale === "hi"
                  ? "यह ईमेल पहले से पंजीकृत है — साइन इन करें।"
                  : "This email is already registered — sign in instead.",
              );
              return;
            }
            if (message === "Invalid credentials") {
              setError(
                locale === "hi"
                  ? "गलत ईमेल या पासवर्ड।"
                  : "Incorrect email or password.",
              );
              return;
            }
            setError(message || a.configureConvex);
          })
          .finally(() => setPending(false));
      }}
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {a.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-zinc-900 outline-none ring-indigo-500/30 placeholder:text-zinc-500 focus:ring-2 dark:text-white"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {a.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={step === "signUp" ? "new-password" : "current-password"}
          required
          minLength={8}
          className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-zinc-900 outline-none ring-indigo-500/30 placeholder:text-zinc-500 focus:ring-2 dark:text-white"
        />
      </div>
      <input name="flow" type="hidden" value={step} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110 disabled:opacity-60"
      >
        {step === "signIn" ? a.submitSignIn : a.submitSignUp}
      </button>
      <button
        type="button"
        className="text-center text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        onClick={() => {
          setStep(step === "signIn" ? "signUp" : "signIn");
          setError(null);
        }}
      >
        {step === "signIn" ? a.toggleToSignUp : a.toggleToSignIn}
      </button>
      {error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      ) : null}
    </form>
  );
}

export function GoogleSignIn() {
  const { locale } = useLocale();
  const a = landingCopy[locale].auth;
  const { signIn } = useAuthActions();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mt-6">
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide text-zinc-500">
          <span className="bg-[var(--background)] px-2">or</span>
        </div>
      </div>
      <button
        type="button"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-white/10 dark:text-zinc-100"
        onClick={() => {
          setError(null);
          void signIn("google", { redirectTo: "/" }).catch((err: unknown) => {
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
          });
        }}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {a.google}
      </button>
      {error ? (
        <p className="mt-3 text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
