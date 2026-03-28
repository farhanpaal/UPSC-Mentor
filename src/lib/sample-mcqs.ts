import type { PrelimsSeedMcq } from "@convex/seed/prelimsData";
import { PRELIMS_BANK_EN, PRELIMS_BANK_HI } from "@convex/seed/prelimsData";

export type SampleMcq = PrelimsSeedMcq;

/** Offline / pre-seed fallback — same bank as Convex `prelimsPyqs.seedBuiltIn`. */
export const SAMPLE_MCQS_EN: SampleMcq[] = PRELIMS_BANK_EN;
export const SAMPLE_MCQS_HI: SampleMcq[] = PRELIMS_BANK_HI;
