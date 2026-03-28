"use client";

import { useLocale } from "@/contexts/locale-context";
import { landingCopy } from "@/lib/landing-copy";
import type { MainsEvalResult } from "@/lib/mains-eval-types";
import { api } from "@convex/_generated/api";
import { PRELIMS_SUBJECT_KEYS } from "@convex/seed/prelimsData";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

type MainsPhase = "pick" | "session" | "exhausted";

const SUBJECT_LABEL_HI: Record<string, string> = {
  Polity: "राजनीति",
  Economy: "अर्थव्यवस्था",
  History: "इतिहास",
  Geography: "भूगोल",
  Environment: "पर्यावरण",
  "Science & Tech": "विज्ञान व तकनीक",
  "Art & Culture": "कला व संस्कृति",
  "Current Affairs": "सामयिकी",
  "International Relations": "अंतरराष्ट्रीय संबंध",
};

export function MainsPractice() {
  const { locale } = useLocale();
  const p = landingCopy[locale].pages.mains;
  const u = landingCopy[locale].mainsUi;
  const signInLabel = landingCopy[locale].signIn;
  const convexLocale = locale === "hi" ? ("hi" as const) : ("en" as const);
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const recordEval = useMutation(api.mainsPractice.recordMainsEval);

  const [phase, setPhase] = useState<MainsPhase>("pick");
  const [subject, setSubject] = useState<string | null>(null);
  const [usedKeys, setUsedKeys] = useState<string[]>([]);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MainsEvalResult | null>(null);

  const pool = useQuery(
    api.mainsPractice.listQuestionsForSubject,
    subject !== null ? { locale: convexLocale, subject } : "skip",
  );

  const currentMeta = useMemo(() => {
    if (!pool || currentKey === null) return null;
    return pool.find((q) => q.key === currentKey) ?? null;
  }, [pool, currentKey]);

  const subjectLabel = useCallback(
    (key: string) => (locale === "hi" ? (SUBJECT_LABEL_HI[key] ?? key) : key),
    [locale],
  );

  const pickNextQuestion = useCallback(() => {
    if (!pool || pool.length === 0) return;
    const avail = pool.filter((q) => !usedKeys.includes(q.key));
    if (avail.length === 0) {
      setPhase("exhausted");
      setCurrentKey(null);
      return;
    }
    const next = avail[Math.floor(Math.random() * avail.length)]!;
    setCurrentKey(next.key);
    setAnswer("");
    setResult(null);
    setError(null);
  }, [pool, usedKeys]);

  useEffect(() => {
    if (phase !== "session" || subject === null || pool === undefined) return;
    if (pool.length === 0) return;
    if (currentKey !== null) return;
    pickNextQuestion();
  }, [phase, subject, pool, currentKey, pickNextQuestion]);

  const words = useMemo(() => countWords(answer), [answer]);
  const answerLocked = loading || result !== null;
  const questionText = currentMeta?.text ?? "";

  const startSubject = (s: string) => {
    setSubject(s);
    setUsedKeys([]);
    setCurrentKey(null);
    setAnswer("");
    setResult(null);
    setError(null);
    setPhase("session");
  };

  const backToPick = () => {
    setPhase("pick");
    setSubject(null);
    setUsedKeys([]);
    setCurrentKey(null);
    setAnswer("");
    setResult(null);
    setError(null);
    setLoading(false);
  };

  async function onEvaluate() {
    if (!currentMeta) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/mains-eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentMeta.text,
          answer,
          maxMarks: currentMeta.maxMarks,
        }),
      });
      const data = (await res.json()) as MainsEvalResult & {
        error?: string;
        detail?: string;
        hint?: string;
      };
      if (!res.ok) {
        const msg = data.hint ? `${data.error ?? u.errorGeneric}\n\n${data.hint}` : (data.error ?? u.errorGeneric);
        setError(msg);
        return;
      }
      if ("error" in data && data.error) {
        setError(data.error);
        return;
      }
      const evaluation = data as MainsEvalResult;
      setResult(evaluation);

      if (isAuthenticated) {
        try {
          await recordEval({
            questionKey: currentMeta.key,
            subject: currentMeta.subject,
            questionText: currentMeta.text,
            answerText: answer,
            marksMax: currentMeta.maxMarks,
            score: evaluation.score,
            feedbackJson: JSON.stringify(evaluation),
          });
        } catch {
          /* leaderboard save failed — feedback still shown */
        }
      }
    } catch {
      setError(u.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  const onNextQuestion = () => {
    if (currentKey !== null) {
      setUsedKeys((prev) => [...prev, currentKey]);
    }
    setCurrentKey(null);
    setAnswer("");
    setResult(null);
    setError(null);
    setPhase("session");
  };

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-3 py-10 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
        UPSCMENTOR
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        {p.title}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:mt-4 sm:text-lg">{p.description}</p>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{u.intro}</p>

      {authLoading ? (
        <div className="mt-12 h-32 animate-pulse rounded-2xl bg-zinc-200/40 dark:bg-white/5" />
      ) : !isAuthenticated ? (
        <div className="glass-card mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-sm text-zinc-600 dark:text-zinc-400 sm:p-5">
          {u.signInToSaveMains}{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-300"
          >
            {signInLabel}
          </Link>
        </div>
      ) : null}

      {phase === "pick" ? (
        <div className="mt-8 sm:mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {u.pickSubject}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {PRELIMS_SUBJECT_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => startSubject(key)}
                className="min-h-11 min-w-[44px] touch-manipulation rounded-xl border border-zinc-200/90 bg-white/80 px-3 py-2.5 text-left text-sm font-medium text-zinc-800 transition hover:border-violet-400/50 hover:bg-violet-50 dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:hover:border-violet-500/40 dark:hover:bg-violet-500/10 sm:px-4"
              >
                {subjectLabel(key)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {phase === "session" && subject ? (
        <div className="mt-8 space-y-6 sm:mt-10">
          {pool === undefined ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{u.loadingQuestions}</p>
          ) : pool.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200/80 bg-white/60 p-6 text-center text-sm text-zinc-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
              <p>{u.exhaustedBody}</p>
              <button
                type="button"
                onClick={backToPick}
                className="mt-4 min-h-11 touch-manipulation rounded-full border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold text-zinc-800 dark:border-white/20 dark:bg-white/5 dark:text-zinc-100"
              >
                {u.backToSubjects}
              </button>
            </div>
          ) : currentMeta ? (
            <>
              <div className="relative overflow-hidden rounded-2xl border border-violet-300/40 bg-gradient-to-br from-violet-500/10 via-white/40 to-indigo-500/10 p-5 dark:border-violet-500/20 dark:via-transparent sm:p-8">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/20 blur-2xl dark:bg-violet-500/15" />
                <div className="relative flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="rounded-full bg-zinc-900/5 px-2.5 py-1 font-medium text-zinc-800 dark:bg-white/15 dark:text-zinc-100">
                    {subjectLabel(currentMeta.subject)}
                  </span>
                  <span className="rounded-full bg-zinc-900/5 px-2 py-0.5 font-mono text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                    {currentMeta.maxMarks} marks
                  </span>
                </div>
                <p className="relative mt-4 whitespace-pre-wrap text-base font-medium leading-relaxed text-zinc-900 dark:text-white">
                  {questionText}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {u.words}: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{words}</span>
                </p>
                <button
                  type="button"
                  onClick={backToPick}
                  disabled={loading}
                  className="min-h-11 w-fit touch-manipulation text-left text-sm font-medium text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline disabled:opacity-50 dark:hover:text-zinc-300"
                >
                  {u.backToSubjects}
                </button>
              </div>

              <div>
                <label htmlFor="mains-a" className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {u.answerLabel}
                </label>
                <textarea
                  id="mains-a"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  readOnly={answerLocked}
                  rows={14}
                  placeholder="…"
                  className="mt-2 min-h-[200px] w-full resize-y rounded-2xl border border-zinc-200/90 bg-white/90 px-3 py-3 text-sm leading-relaxed text-zinc-900 outline-none ring-violet-500/20 focus:ring-2 dark:border-white/15 dark:bg-white/5 dark:text-white sm:px-4"
                />
              </div>

              {!loading && result === null ? (
                <button
                  type="button"
                  disabled={!answer.trim()}
                  onClick={() => void onEvaluate()}
                  className="min-h-11 w-full touch-manipulation rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {u.evaluate}
                </button>
              ) : null}

              {loading ? (
                <div
                  className="flex items-center gap-3 rounded-xl border border-zinc-200/80 bg-white/70 px-4 py-3 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                  role="status"
                  aria-live="polite"
                >
                  <span
                    className="inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-solid border-violet-500 border-r-transparent dark:border-violet-400"
                    aria-hidden
                  />
                  {u.evaluating}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/30 dark:text-amber-100">
                  {error}
                </div>
              ) : null}

              {result ? (
                <div className="space-y-6">
                  <div className="glass-card space-y-4 rounded-2xl border border-emerald-500/25 p-5 sm:p-8">
                    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-zinc-200/60 pb-4 dark:border-white/10">
                      <span className="sr-only">Evaluation score</span>
                      <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-violet-700 dark:text-violet-300 sm:text-4xl">
                        {result.score}
                        <span className="text-xl font-semibold text-zinc-400 dark:text-zinc-500">
                          {" "}
                          / {result.maxScore}
                        </span>
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{result.summary}</p>
                    {result.structure ? (
                      <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          {u.headingStructure}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{result.structure}</p>
                      </section>
                    ) : null}
                    {result.contentDepth ? (
                      <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          {u.headingContent}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{result.contentDepth}</p>
                      </section>
                    ) : null}
                    {result.strengths.length > 0 ? (
                      <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          {u.headingStrengths}
                        </h3>
                        <ul className="mt-1 list-inside list-disc text-sm text-zinc-700 dark:text-zinc-300">
                          {result.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </section>
                    ) : null}
                    {result.improvements.length > 0 ? (
                      <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          {u.headingImprovements}
                        </h3>
                        <ul className="mt-1 list-inside list-disc text-sm text-zinc-700 dark:text-zinc-300">
                          {result.improvements.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </section>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      type="button"
                      onClick={onNextQuestion}
                      className="min-h-11 touch-manipulation rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20"
                    >
                      {u.nextQuestion}
                    </button>
                    <button
                      type="button"
                      onClick={backToPick}
                      className="min-h-11 touch-manipulation rounded-full border border-zinc-200/90 bg-white/80 px-6 py-3 text-sm font-semibold text-zinc-800 dark:border-white/20 dark:bg-white/5 dark:text-zinc-100"
                    >
                      {u.backToSubjects}
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{u.loadingQuestions}</p>
          )}
        </div>
      ) : null}

      {phase === "exhausted" ? (
        <div className="mt-8 rounded-2xl border border-zinc-200/80 bg-white/60 p-6 text-center dark:border-white/10 dark:bg-white/[0.03] sm:mt-10 sm:p-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{u.exhaustedTitle}</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{u.exhaustedBody}</p>
          <button
            type="button"
            onClick={backToPick}
            className="mt-6 min-h-11 touch-manipulation rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white"
          >
            {u.backToSubjects}
          </button>
        </div>
      ) : null}
    </main>
  );
}
