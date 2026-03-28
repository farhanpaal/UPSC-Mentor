"use client";

import { useLocale } from "@/contexts/locale-context";
import { landingCopy, type PracticePageCopy, type PracticeUiCopy } from "@/lib/landing-copy";
import { pickMcqSet } from "@/lib/practice-utils";
import type { SampleMcq } from "@/lib/sample-mcqs";
import { SAMPLE_MCQS_EN, SAMPLE_MCQS_HI } from "@/lib/sample-mcqs";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { PRELIMS_SUBJECT_KEYS } from "@convex/seed/prelimsData";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const MOCK_TIME_MS = 60 * 60 * 1000;
const QUICK_COUNT = 10;
const MOCK_COUNT = 60;

function hasConvexUrl() {
  return (
    typeof process.env.NEXT_PUBLIC_CONVEX_URL === "string" &&
    process.env.NEXT_PUBLIC_CONVEX_URL.length > 0
  );
}

function rowToSampleMcq(row: Doc<"prelimsPyqs">): SampleMcq | null {
  const opts = row.options;
  if (opts.length !== 4) return null;
  const ci = row.correctIndex;
  if (ci < 0 || ci > 3 || !Number.isInteger(ci)) return null;
  return {
    id: row._id,
    subject: row.subject,
    topic: row.topic,
    year: row.year,
    question: row.question,
    options: [opts[0], opts[1], opts[2], opts[3]],
    correctIndex: ci as 0 | 1 | 2 | 3,
    explanation: row.explanation,
  };
}

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

type Phase = "pick" | "run" | "results";
type Mode = "quick10" | "mock60" | "incorrect10";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]!;
    a[i] = a[j]!;
    a[j] = t;
  }
  return a;
}

function PracticeViewWithConvex() {
  const { locale } = useLocale();
  const t = landingCopy[locale].practiceUi;
  const p = landingCopy[locale].pages.practice;
  const staticBank = locale === "hi" ? SAMPLE_MCQS_HI : SAMPLE_MCQS_EN;
  const convexLocale = locale === "hi" ? ("hi" as const) : ("en" as const);
  const convexRows = useQuery(api.prelimsPyqs.listForPractice, { locale: convexLocale });
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const wrongIdData = useQuery(api.practice.getIncorrectQuestionIds, isAuthenticated ? {} : "skip");
  const completeSession = useMutation(api.practice.completeMcqSession);

  const bank = useMemo(() => {
    if (convexRows === undefined) return staticBank;
    if (convexRows.length === 0) return staticBank;
    const mapped = convexRows.map(rowToSampleMcq).filter((q): q is SampleMcq => q !== null);
    return mapped.length > 0 ? mapped : staticBank;
  }, [convexRows, staticBank]);

  const [phase, setPhase] = useState<Phase>("pick");
  const [mode, setMode] = useState<Mode | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [pickError, setPickError] = useState<string | null>(null);
  const [items, setItems] = useState<SampleMcq[]>([]);
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState<(0 | 1 | 2 | 3 | null)[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [mockLeftMs, setMockLeftMs] = useState(MOCK_TIME_MS);
  const [testStartedAt, setTestStartedAt] = useState<number>(0);
  const questionT0 = useRef<number>(0);
  const questionTimes = useRef<number[]>([]);
  const savedRef = useRef(false);
  const itemsRef = useRef<SampleMcq[]>([]);
  const choicesRef = useRef<(0 | 1 | 2 | 3 | null)[]>([]);
  const modeRef = useRef<Mode | null>(null);
  const subjectRef = useRef<string | null>(null);
  const testStartedAtRef = useRef(0);
  itemsRef.current = items;
  choicesRef.current = choices;
  modeRef.current = mode;
  subjectRef.current = subject;
  testStartedAtRef.current = testStartedAt;

  const subjectLabel = useCallback(
    (key: string) => (locale === "hi" ? (SUBJECT_LABEL_HI[key] ?? key) : key),
    [locale],
  );

  useEffect(() => {
    questionTimes.current = items.map(() => 0);
    setChoices(items.map(() => null));
  }, [items]);

  useEffect(() => {
    if (phase !== "run" || mode !== "mock60") return;
    const id = setInterval(() => {
      setMockLeftMs((ms) => (ms <= 1000 ? 0 : ms - 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [phase, mode]);

  useEffect(() => {
    if (phase !== "run") return;
    questionT0.current = Date.now();
  }, [phase, idx]);

  const startTest = (m: Mode, subj: string | null) => {
    if (!isAuthenticated) return;
    setPickError(null);
    const count = m === "quick10" || m === "incorrect10" ? QUICK_COUNT : MOCK_COUNT;
    const picked =
      m === "incorrect10"
        ? (() => {
            const ids = new Set(wrongIdData?.ids ?? []);
            if (ids.size === 0) return [] as SampleMcq[];
            const candidates = bank.filter((q) => ids.has(String(q.id)));
            return shuffleArray(candidates).slice(0, QUICK_COUNT);
          })()
        : pickMcqSet(bank, subj, count);
    if (picked.length === 0) {
      if (m === "incorrect10") {
        setPickError(
          (wrongIdData?.ids?.length ?? 0) === 0 ? t.noIncorrectYet : t.noIncorrectInBank,
        );
      }
      return;
    }
    setMode(m);
    setSubject(subj);
    setItems(picked);
    setIdx(0);
    setRevealed(false);
    setMockLeftMs(MOCK_TIME_MS);
    setTestStartedAt(Date.now());
    savedRef.current = false;
    setPhase("run");
  };

  const correctSoFar = useMemo(() => {
    return items.reduce((n, q, i) => {
      const c = choices[i];
      return n + (c !== null && c === q.correctIndex ? 1 : 0);
    }, 0);
  }, [items, choices]);

  const endTest = useCallback(async () => {
    if (savedRef.current) return;
    const m = modeRef.current;
    const its = itemsRef.current;
    const ch = choicesRef.current;
    if (!m || its.length === 0) return;
    savedRef.current = true;

    const attempts = its.map((q, i) => {
      const choice = ch[i];
      const correct = choice !== null && choice === q.correctIndex;
      return {
        questionId: String(q.id),
        subject: q.subject,
        topic: q.topic,
        year: q.year,
        correct,
        timeMs: questionTimes.current[i] ?? undefined,
      };
    });
    const durationMs = Math.max(0, Date.now() - testStartedAtRef.current);

    if (isAuthenticated) {
      try {
        await completeSession({
          mode: m,
          subject: m === "incorrect10" ? undefined : subjectRef.current ?? undefined,
          durationMs,
          timeLimitMs: m === "mock60" ? MOCK_TIME_MS : undefined,
          attempts,
        });
      } catch {
        savedRef.current = false;
        return;
      }
    }
    setPhase("results");
  }, [isAuthenticated, completeSession]);

  useEffect(() => {
    if (phase !== "run" || mode !== "mock60" || mockLeftMs > 0) return;
    void endTest();
  }, [phase, mode, mockLeftMs, endTest]);

  const finishQuickToResults = () => {
    const t0 = questionT0.current;
    const dt = Date.now() - t0;
    questionTimes.current[idx] = (questionTimes.current[idx] ?? 0) + dt;
    void endTest();
  };

  const onPickOption = (opt: 0 | 1 | 2 | 3) => {
    if (choices[idx] !== null && mode === "mock60") return;
    setChoices((prev) => {
      const next = [...prev];
      next[idx] = opt;
      return next;
    });
    if (mode === "quick10" || mode === "incorrect10") setRevealed(true);
  };

  const goNext = () => {
    const t0 = questionT0.current;
    const dt = Date.now() - t0;
    questionTimes.current[idx] = (questionTimes.current[idx] ?? 0) + dt;

    if (mode === "quick10" || mode === "incorrect10") {
      if (!revealed) return;
      if (idx >= items.length - 1) {
        finishQuickToResults();
        return;
      }
      setIdx((i) => i + 1);
      setRevealed(false);
      return;
    }

    if (idx >= items.length - 1) {
      void endTest();
      return;
    }
    setIdx((i) => i + 1);
  };

  const resetToPick = () => {
    setPhase("pick");
    setMode(null);
    setSubject(null);
    setItems([]);
    setIdx(0);
    setChoices([]);
    setRevealed(false);
    savedRef.current = false;
    setPickError(null);
  };

  const playAgainSame = () => {
    if (!mode) return;
    startTest(mode, subject);
  };

  const labels = ["A", "B", "C", "D"] as const;
  const current = items[idx];
  const choice = choices[idx];

  const mockClock =
    mode === "mock60" && phase === "run"
      ? `${String(Math.floor(mockLeftMs / 60000)).padStart(2, "0")}:${String(Math.floor((mockLeftMs % 60000) / 1000)).padStart(2, "0")}`
      : null;

  if (!hasConvexUrl()) {
    return (
      <PracticeStaticFallback
        locale={locale}
        p={p}
        t={t}
        bank={bank}
        subjectLabel={subjectLabel}
      />
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <header className="border-b border-white/10 pb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
          UPSCMENTOR
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          {p.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{p.description}</p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.dataNote}</p>
      </header>

      {authLoading ? (
        <div className="mt-12 h-40 animate-pulse rounded-2xl bg-white/5" />
      ) : !isAuthenticated ? (
        <div className="glass-card mt-10 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-8 text-center">
          <p className="text-lg font-semibold text-zinc-900 dark:text-white">{t.signInToPracticeTitle}</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t.signInToPracticeBody}</p>
          <Link
            href="/sign-in"
            className="mt-6 inline-flex rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25"
          >
            {t.signInCta}
          </Link>
        </div>
      ) : phase === "pick" ? (
        <div className="mt-10 space-y-10">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">{t.quickTitle}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t.quickSubtitle}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {PRELIMS_SUBJECT_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => startTest("quick10", key)}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-left text-sm font-medium text-zinc-800 transition hover:border-indigo-500/40 hover:bg-indigo-500/10 dark:text-zinc-100"
                >
                  {subjectLabel(key)}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-rose-500/25 bg-rose-500/[0.07] p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-rose-800 dark:text-rose-200">
                  {t.incorrectTitle}
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t.incorrectSubtitle}</p>
              </div>
              <button
                type="button"
                disabled={wrongIdData === undefined}
                onClick={() => startTest("incorrect10", null)}
                className="shrink-0 rounded-full bg-gradient-to-r from-rose-600 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.incorrectStart}
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-200">
                  {t.mockTitle}
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t.mockSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => startTest("mock60", null)}
                className="shrink-0 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-md"
              >
                {t.mockStart}
              </button>
            </div>
          </section>

          {pickError ? (
            <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{pickError}</p>
          ) : null}

          {bank.length < QUICK_COUNT && (
            <p className="text-xs text-amber-700 dark:text-amber-300">{t.smallBankHint}</p>
          )}
        </div>
      ) : phase === "run" && current ? (
        <div className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {mockClock !== null ? (
              <span className="rounded-full bg-amber-500/15 px-3 py-1 font-mono text-sm font-semibold text-amber-900 dark:text-amber-100">
                {t.timeLeft} {mockClock}
              </span>
            ) : null}
            <span className="text-zinc-500">
              {t.questionProgress.replace("{n}", String(idx + 1)).replace("{t}", String(items.length))}
            </span>
            <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-xs text-zinc-600 dark:text-zinc-300">
              {mode === "quick10"
                ? t.badgeQuick
                : mode === "incorrect10"
                  ? t.badgeIncorrect
                  : t.badgeMock}
            </span>
          </div>

          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
              <span className="rounded-full bg-white/10 px-2 py-0.5 font-medium text-zinc-700 dark:text-zinc-200">
                {subjectLabel(current.subject)}
              </span>
              <span>{current.year}</span>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-zinc-900 dark:text-zinc-100">
              {current.question}
            </p>
            <div className="mt-6 space-y-2">
              {current.options.map((opt, i) => {
                const o = i as 0 | 1 | 2 | 3;
                const sel = choice === o;
                let ring = "border-white/15";
                if ((mode === "quick10" || mode === "incorrect10") && revealed) {
                  if (o === current.correctIndex) ring = "border-emerald-500/60 bg-emerald-500/10";
                  else if (sel && o !== current.correctIndex) ring = "border-red-500/50 bg-red-500/10";
                } else if (sel) ring = "border-indigo-500/50 bg-indigo-500/10";
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={(mode === "quick10" || mode === "incorrect10") && revealed}
                    onClick={() => onPickOption(o)}
                    className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${ring}`}
                  >
                    <span className="font-semibold text-indigo-600 dark:text-indigo-300">{labels[i]}.</span>
                    <span className="text-zinc-800 dark:text-zinc-200">{opt}</span>
                  </button>
                );
              })}
            </div>

            {(mode === "quick10" || mode === "incorrect10") && revealed ? (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-semibold text-zinc-900 dark:text-white">{t.explanation}: </span>
                {current.explanation}
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              {mode === "quick10" || mode === "incorrect10" ? (
                <button
                  type="button"
                  disabled={choice === null || !revealed}
                  onClick={goNext}
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                >
                  {idx >= items.length - 1 ? t.finishTest : t.next}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={choice === null}
                  onClick={goNext}
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                >
                  {idx >= items.length - 1 ? t.finishTest : t.next}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : phase === "results" ? (
        <ResultsPanel
          t={t}
          items={items}
          choices={choices}
          mode={mode}
          subjectLabel={subjectLabel}
          correctSoFar={correctSoFar}
          isAuthenticated={isAuthenticated}
          onPlayAgain={playAgainSame}
          onHome={resetToPick}
        />
      ) : null}
    </main>
  );
}

function ResultsPanel({
  t,
  items,
  choices,
  mode,
  subjectLabel,
  correctSoFar,
  isAuthenticated,
  onPlayAgain,
  onHome,
}: {
  t: PracticeUiCopy;
  items: SampleMcq[];
  choices: (0 | 1 | 2 | 3 | null)[];
  mode: Mode | null;
  subjectLabel: (k: string) => string;
  correctSoFar: number;
  isAuthenticated: boolean;
  onPlayAgain: () => void;
  onHome: () => void;
}) {
  const total = items.length;
  const pct = total === 0 ? 0 : Math.round((correctSoFar / total) * 100);

  return (
    <div className="mt-10 space-y-8">
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">{t.resultsTitle}</p>
        <p className="mt-4 font-[family-name:var(--font-display)] text-5xl font-bold text-zinc-900 dark:text-white">
          {correctSoFar}
          <span className="text-2xl font-semibold text-zinc-500">/{total}</span>
        </p>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          {t.scorePercent.replace("{n}", String(pct))}
        </p>
        {!isAuthenticated ? (
          <p className="mt-4 text-sm text-amber-700 dark:text-amber-300">{t.guestNoSave}</p>
        ) : (
          <p className="mt-4 text-sm text-emerald-700 dark:text-emerald-300">{t.savedToDashboard}</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20"
          >
            {t.playAgain}
          </button>
          <button
            type="button"
            onClick={onHome}
            className="rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-semibold text-zinc-800 dark:text-zinc-100"
          >
            {t.quitToMenu}
          </button>
        </div>
      </div>

      {mode === "mock60" ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{t.reviewTitle}</h3>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            {items.map((q, i) => {
              const c = choices[i];
              const ok = c === q.correctIndex;
              return (
                <li
                  key={String(q.id) + i}
                  className={`rounded-xl border px-3 py-2 ${ok ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/25 bg-red-500/5"}`}
                >
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">{subjectLabel(q.subject)}</span>
                  {" — "}
                  {ok ? t.correct : t.incorrect}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** Offline demo when Convex URL missing — simplified pick + run without persistence. */
function PracticeStaticFallback({
  locale,
  p,
  t,
  bank,
  subjectLabel,
}: {
  locale: "en" | "hi";
  p: PracticePageCopy;
  t: PracticeUiCopy;
  bank: SampleMcq[];
  subjectLabel: (k: string) => string;
}) {
  const [phase, setPhase] = useState<Phase>("pick");
  const [items, setItems] = useState<SampleMcq[]>([]);
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState<(0 | 1 | 2 | 3 | null)[]>([]);
  const [revealed, setRevealed] = useState(false);

  const start = (subj: string | null) => {
    const picked = pickMcqSet(bank, subj, QUICK_COUNT);
    if (picked.length === 0) return;
    setItems(picked);
    setIdx(0);
    setChoices(picked.map(() => null));
    setRevealed(false);
    setPhase("run");
  };

  const current = items[idx];
  const choice = choices[idx];

  const correctSoFar = items.reduce((n, q, i) => {
    const c = choices[i];
    return n + (c !== null && c === q.correctIndex ? 1 : 0);
  }, 0);

  if (phase === "pick") {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{p.title}</h1>
        <p className="mt-2 text-amber-700 dark:text-amber-300">{t.configureConvexFallback}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {PRELIMS_SUBJECT_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => start(key)}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium"
            >
              {subjectLabel(key)}
            </button>
          ))}
        </div>
      </main>
    );
  }

  if (phase === "run" && current) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <p className="text-sm text-zinc-500">
          {idx + 1}/{items.length}
        </p>
        <p className="mt-4 text-zinc-900 dark:text-white">{current.question}</p>
        <div className="mt-4 space-y-2">
          {current.options.map((opt, i) => {
            const o = i as 0 | 1 | 2 | 3;
            const sel = choice === o;
            return (
              <button
                key={i}
                type="button"
                disabled={revealed}
                onClick={() => {
                  const next = [...choices];
                  next[idx] = o;
                  setChoices(next);
                  setRevealed(true);
                }}
                className={`block w-full rounded-xl border px-4 py-2 text-left text-sm ${sel ? "border-indigo-500" : "border-white/15"}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {revealed && (
          <button
            type="button"
            className="mt-4 rounded-full bg-indigo-600 px-6 py-2 text-sm text-white"
            onClick={() => {
              if (idx >= items.length - 1) setPhase("results");
              else {
                setIdx(idx + 1);
                setRevealed(false);
              }
            }}
          >
            {idx >= items.length - 1 ? t.finishTest : t.next}
          </button>
        )}
      </main>
    );
  }

  if (phase === "results") {
    return (
      <ResultsPanel
        t={t}
        items={items}
        choices={choices}
        mode="quick10"
        subjectLabel={subjectLabel}
        correctSoFar={correctSoFar}
        isAuthenticated={false}
        onPlayAgain={() => {
          setPhase("pick");
          setItems([]);
        }}
        onHome={() => {
          setPhase("pick");
          setItems([]);
        }}
      />
    );
  }

  return null;
}

export function PracticeView() {
  const { locale } = useLocale();
  if (!hasConvexUrl()) {
    const bank = locale === "hi" ? SAMPLE_MCQS_HI : SAMPLE_MCQS_EN;
    return (
      <PracticeStaticFallback
        locale={locale}
        p={landingCopy[locale].pages.practice}
        t={landingCopy[locale].practiceUi}
        bank={bank}
        subjectLabel={(k) => (locale === "hi" ? (SUBJECT_LABEL_HI[k] ?? k) : k)}
      />
    );
  }
  return <PracticeViewWithConvex />;
}
