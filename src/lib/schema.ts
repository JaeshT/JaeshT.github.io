// Content schema — the shapes of every data file under public/content/.
// Content is git-versioned & cacheable; USER STATE (attempts/SRS) lives in IndexedDB, never here.
//
// The model has exactly two axes:
//   1. MODULE — a rung on the curriculum ladder (accounting -> valuation -> DCF -> M&A -> LBO -> ...)
//   2. TIER   — easy / medium / hard *within* a module. You clear a tier to open the next one.
// A question may additionally carry a SECTOR tag (TMT, FIG, …) so sector desks can slice the bank.

export type Tier = 'easy' | 'medium' | 'hard';
export const TIERS: Tier[] = ['easy', 'medium', 'hard'];

export const TIER_LABEL: Record<Tier, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

/** Which ladder a module belongs to. Core is the gated spine; the others are always open. */
export type Track = 'core' | 'sector' | 'fit';

export type Sector =
  | 'tmt'
  | 'saas'
  | 'fig'
  | 'healthcare'
  | 'consumer'
  | 'industrials'
  | 'oil-gas'
  | 'power-renewables'
  | 'real-estate'
  | 'restructuring'
  | 'levfin'
  | 'ecm'
  | 'sponsors';

export const SECTOR_LABEL: Record<Sector, string> = {
  tmt: 'TMT',
  saas: 'SaaS',
  fig: 'FIG',
  healthcare: 'Healthcare',
  consumer: 'Consumer & Retail',
  industrials: 'Industrials',
  'oil-gas': 'Oil & Gas',
  'power-renewables': 'Power & Renewables',
  'real-estate': 'Real Estate',
  restructuring: 'Restructuring',
  levfin: 'DCM & LevFin',
  ecm: 'ECM',
  sponsors: 'Financial Sponsors',
};

// ---- Manifest ----

export interface LessonRef {
  id: string;
  title: string;
  path: string; // markdown under content/, e.g. "lessons/accounting/primer.md"
  tier?: Tier; // which stage this primer belongs to (defaults to easy)
  estMinutes?: number;
}

export interface ModuleRef {
  id: string; // 'accounting'
  title: string; // 'Accounting & the Three Statements'
  short: string; // 'Accounting'
  icon: string;
  track: Track;
  order: number; // position on its ladder
  blurb: string;
  bank?: string; // path to the question bank json; absent = not built yet
  lessons?: LessonRef[];
  sector?: Sector; // set on sector-desk modules
}

/** The master manifest at content/index.json — the extensibility backbone. */
export interface ContentIndex {
  version: number;
  updated?: string;
  modules: ModuleRef[];
  glossary?: { paths: string[] };
}

// ---- The question: one unit, three uses (drill, spaced review, graded check) ----

/** An objectively gradeable check attached to a question. Optional — most questions are spoken. */
export type Check =
  | {
      type: 'mcq';
      choices: string[];
      answerIndex: number;
      explanation?: string;
    }
  | {
      type: 'numeric';
      answer: number;
      tolerance?: number; // absolute; defaults to 1% of |answer|
      unit?: string;
      explanation?: string;
    };

export interface Question {
  id: string;
  tier: Tier;
  prompt: string;
  /** The say-it-out-loud answer — roughly 60 seconds of speech. Markdown. */
  answer: string;
  /** What you say when they push further. Markdown. */
  deepDive?: string;
  /** Must-hit points. Present on walkthrough questions; you self-grade against them. */
  keyPoints?: string[];
  sector?: Sector;
  tags?: string[];
  check?: Check;
}

export interface QuestionBank {
  module: string; // module id
  title: string;
  questions: Question[];
}

// ---- Glossary ----

export interface GlossaryTerm {
  term: string;
  definition: string;
  tags?: string[];
}

export interface Glossary {
  terms: GlossaryTerm[];
}
