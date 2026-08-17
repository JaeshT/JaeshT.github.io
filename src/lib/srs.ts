// Spaced repetition, using FSRS (the Free Spaced Repetition Scheduler).
//
// This replaces the SM-2 scheduler. SM-2 tracks one number per card, an "ease" multiplier, and
// multiplies the interval by it. FSRS models memory with three quantities instead, which is what
// modern Anki now schedules with:
//
//   Stability (S)      days for recall probability to fall from 100% to 90%
//   Difficulty (D)     1 to 10, how hard this card is for you
//   Retrievability (R) probability you still know it, given how long it has been
//
// The interval is then whatever keeps R at the target retention on the day it comes back. At the
// default 90% target the interval works out exactly equal to stability, which is a good sanity
// check on the arithmetic below.
//
// Parameters are the published FSRS-5 defaults, fitted on hundreds of millions of real reviews.
// They are not tuned to this deck: doing that properly needs a few thousand of your own reviews,
// and the defaults are what Anki ships until then.
//
// Sources:
//   https://borretti.me/article/implementing-fsrs-in-100-lines
//   https://expertium.github.io/Algorithm.html
//   https://github.com/open-spaced-repetition

import type { SrsState } from './db';

export type Grade = 'again' | 'hard' | 'good' | 'easy';

/** FSRS numbers grades 1 to 4, and several formulas use that number directly. */
const GRADE_N: Record<Grade, number> = { again: 1, hard: 2, good: 3, easy: 4 };
export const GRADES: Grade[] = ['again', 'hard', 'good', 'easy'];

// FSRS-5 default parameters, w[0] through w[18].
const W = [
  0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192, 1.01925,
  1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621,
];

const DECAY = -0.5;
/** Chosen so that R = 0.9 exactly when elapsed time equals stability. Works out to 19/81. */
const FACTOR = Math.pow(0.9, 1 / DECAY) - 1;

/** Target recall probability at review time. 0.9 is the FSRS and Anki default. */
export const DESIRED_RETENTION = 0.9;

const MIN_STABILITY = 0.01;
const MAX_INTERVAL_DAYS = 365 * 10;
const MIN = 60 * 1000;
const DAY = 24 * 60 * MIN;

/** A lapse comes back inside the same session rather than tomorrow. */
export const RELEARN_DELAY = 10 * MIN;

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

// ---- the model ----

/** Probability of recall after `days` have passed for a card of the given stability. */
export function retrievability(days: number, stability: number): number {
  if (stability <= 0) return 0;
  return Math.pow(1 + (FACTOR * Math.max(0, days)) / stability, DECAY);
}

/** How many days until recall probability decays to the target. At 90% this equals stability. */
export function intervalFor(stability: number, retention = DESIRED_RETENTION): number {
  const raw = (stability / FACTOR) * (Math.pow(retention, 1 / DECAY) - 1);
  return clamp(raw, 1, MAX_INTERVAL_DAYS);
}

function initialStability(grade: Grade): number {
  return clamp(W[GRADE_N[grade] - 1], MIN_STABILITY, MAX_INTERVAL_DAYS);
}

function initialDifficulty(grade: Grade): number {
  return clamp(W[4] - Math.exp(W[5] * (GRADE_N[grade] - 1)) + 1, 1, 10);
}

/** Difficulty drifts with each answer, then reverts slightly toward the "easy" baseline. */
function nextDifficulty(difficulty: number, grade: Grade): number {
  const delta = -W[6] * (GRADE_N[grade] - 3);
  // damped so difficulty moves less as it approaches the top of the scale
  const damped = difficulty + delta * ((10 - difficulty) / 9);
  const reverted = W[7] * initialDifficulty('easy') + (1 - W[7]) * damped;
  return clamp(reverted, 1, 10);
}

/** Stability after a successful recall. Grows most when the card was nearly forgotten. */
function stabilityOnSuccess(s: number, d: number, r: number, grade: Grade): number {
  const hardPenalty = grade === 'hard' ? W[15] : 1;
  const easyBonus = grade === 'easy' ? W[16] : 1;
  const growth =
    1 +
    Math.exp(W[8]) *
      (11 - d) *
      Math.pow(s, -W[9]) *
      (Math.exp(W[10] * (1 - r)) - 1) *
      hardPenalty *
      easyBonus;
  return clamp(s * growth, MIN_STABILITY, MAX_INTERVAL_DAYS);
}

/** Stability after a lapse. Never higher than it was before you forgot. */
function stabilityOnLapse(s: number, d: number, r: number): number {
  const post =
    W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r));
  return clamp(Math.min(post, s), MIN_STABILITY, MAX_INTERVAL_DAYS);
}

// ---- state ----

export function freshState(now = Date.now()): SrsState {
  return {
    stability: 0,
    difficulty: 0,
    interval: 0,
    reps: 0,
    lapses: 0,
    due: now,
    lastReview: 0,
  };
}

/**
 * Records written by the old SM-2 scheduler have an `ease` but no `stability`. Rather than trying
 * to translate one model into the other, which cannot be done honestly, every such card restarts
 * as "seen before, not solid yet": the stability FSRS assigns to a card first answered Hard, and
 * due immediately so it comes back around.
 */
export function migrateLegacy(prev: SrsState, now = Date.now()): SrsState {
  return {
    stability: initialStability('hard'),
    difficulty: initialDifficulty('hard'),
    interval: Math.round(intervalFor(initialStability('hard'))),
    reps: prev.reps ?? 0,
    lapses: prev.lapses ?? 0,
    due: now,
    lastReview: prev.lastReview ?? 0,
  };
}

function normalise(prev: SrsState | undefined, now: number): SrsState {
  if (!prev) return freshState(now);
  if (typeof prev.stability === 'number' && prev.stability > 0) return prev;
  if (prev.reps > 0) return migrateLegacy(prev, now); // an SM-2 record
  return freshState(now);
}

export function isNew(state: SrsState | undefined): boolean {
  return !state || !state.reps;
}

/** Grade a card and get its next state. */
export function review(prev: SrsState | undefined, grade: Grade, now = Date.now()): SrsState {
  const s = normalise(prev, now);

  if (isNew(s)) {
    const stability = initialStability(grade);
    const difficulty = initialDifficulty(grade);
    const days = Math.round(intervalFor(stability));
    return {
      stability,
      difficulty,
      interval: grade === 'again' ? 0 : days,
      reps: 1,
      lapses: grade === 'again' ? 1 : 0,
      due: grade === 'again' ? now + RELEARN_DELAY : now + days * DAY,
      lastReview: now,
    };
  }

  const elapsedDays = s.lastReview ? Math.max(0, (now - s.lastReview) / DAY) : 0;
  const r = retrievability(elapsedDays, s.stability);
  const difficulty = nextDifficulty(s.difficulty, grade);
  const stability =
    grade === 'again'
      ? stabilityOnLapse(s.stability, s.difficulty, r)
      : stabilityOnSuccess(s.stability, s.difficulty, r, grade);
  const days = Math.round(intervalFor(stability));

  return {
    stability,
    difficulty,
    interval: grade === 'again' ? 0 : days,
    reps: s.reps + 1,
    lapses: s.lapses + (grade === 'again' ? 1 : 0),
    due: grade === 'again' ? now + RELEARN_DELAY : now + days * DAY,
    lastReview: now,
  };
}

/** What each button will actually do, so the labels can say it before you commit. */
export function previewIntervals(
  prev: SrsState | undefined,
  now = Date.now(),
): Record<Grade, string> {
  const out = {} as Record<Grade, string>;
  for (const g of GRADES) out[g] = formatDelay(review(prev, g, now).due - now);
  return out;
}

export function formatDelay(ms: number): string {
  if (ms < MIN) return '<1m';
  if (ms < 60 * MIN) return `${Math.round(ms / MIN)}m`;
  if (ms < DAY) return `${Math.round(ms / (60 * MIN))}h`;
  const days = ms / DAY;
  if (days < 30) return `${Math.round(days)}d`;
  if (days < 365) return `${(days / 30).toFixed(days < 60 ? 1 : 0)}mo`;
  return `${(days / 365).toFixed(1)}y`;
}

/** Is this card due now? No state means never studied, which counts as due. */
export function isDue(state: SrsState | undefined, now = Date.now()): boolean {
  return !state || state.due <= now;
}

/** Coarse label for the UI: new, still settling, or on a real schedule. */
export function phaseOf(state: SrsState | undefined, now = Date.now()): 'new' | 'learning' | 'review' {
  if (isNew(state)) return 'new';
  const s = normalise(state, now);
  return s.interval >= 1 ? 'review' : 'learning';
}
