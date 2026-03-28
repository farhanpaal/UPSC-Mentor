import type { SampleMcq } from "@/lib/sample-mcqs";

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

/** Random `count` MCQs, optionally filtered by GS subject. */
export function pickMcqSet(bank: SampleMcq[], subject: string | null, count: number): SampleMcq[] {
  const pool = subject === null ? [...bank] : bank.filter((q) => q.subject === subject);
  if (pool.length === 0) return [];
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}
