// Spaced repetition, modelled on Anki's SM-2 scheduler.
//
// Cards move through phases: learning (short steps in minutes) -> review (intervals in days).
// Missing a review card sends it to relearning and cuts its ease. The four grades are the same
// ones Anki uses, and the UI shows what each one will do before you press it.

import type { SrsState } from './db';

export type Grade = 'again' | 'hard' | 'good' | 'easy';

const MIN = 60 * 1000;
const DAY = 24 * 60 * MIN;

export const LEARN_STEPS = [1 * MIN, 10 * MIN]; // graduate after the last one
export const RELEARN_STEPS = [10 * MIN];
export const GRADUATING_INTERVAL = 1; // days, after finishing learning with "good"
export const EASY_INTERVAL = 4; // days, when "easy" is pressed during learning
export const MIN_EASE = 1.3;
export const STARTING_EASE = 2.5;
export const EASY_BONUS = 1.3;
export const HARD_FACTOR = 1.2;
export const LAPSE_INTERVAL = 1; // days to come back at after a lapse

export function freshState(now = Date.now()): SrsState {
  return {
    phase: 'learning',
    step: 0,
    ease: STARTING_EASE,
    interval: 0,
    reps: 0,
    lapses: 0,
    due: now,
    lastReview: 0,
  };
}

/** Older records predate the phase fields; treat anything with reps as an established review card. */
function normalise(prev: SrsState | undefined, now: number): SrsState {
  if (!prev) return freshState(now);
  if (prev.phase) return prev;
  return {
    ...prev,
    phase: prev.reps >= 2 ? 'review' : 'learning',
    step: 0,
    lapses: 0,
  };
}

export function review(prev: SrsState | undefined, grade: Grade, now = Date.now()): SrsState {
  const s = normalise(prev, now);
  const next: SrsState = { ...s, reps: s.reps + 1, lastReview: now };

  if (s.phase === 'learning' || s.phase === 'relearning') {
    const steps = s.phase === 'learning' ? LEARN_STEPS : RELEARN_STEPS;

    if (grade === 'again') {
      next.step = 0;
      next.due = now + steps[0];
      return next;
    }
    if (grade === 'easy') {
      // skip the remaining steps
      next.phase = 'review';
      next.step = 0;
      next.interval = s.phase === 'relearning' ? Math.max(LAPSE_INTERVAL, s.interval) : EASY_INTERVAL;
      next.due = now + next.interval * DAY;
      return next;
    }
    // hard repeats the current step; good advances
    const step = grade === 'hard' ? s.step : s.step + 1;
    if (step >= steps.length) {
      next.phase = 'review';
      next.step = 0;
      next.interval = s.phase === 'relearning' ? Math.max(LAPSE_INTERVAL, s.interval) : GRADUATING_INTERVAL;
      next.due = now + next.interval * DAY;
      return next;
    }
    next.step = step;
    next.due = now + steps[step];
    return next;
  }

  // established review card
  if (grade === 'again') {
    next.phase = 'relearning';
    next.step = 0;
    next.lapses = s.lapses + 1;
    next.ease = Math.max(MIN_EASE, s.ease - 0.2);
    next.interval = LAPSE_INTERVAL;
    next.due = now + RELEARN_STEPS[0];
    return next;
  }

  const base = Math.max(1, s.interval || 1);
  if (grade === 'hard') {
    next.ease = Math.max(MIN_EASE, s.ease - 0.15);
    next.interval = Math.max(base + 1, Math.round(base * HARD_FACTOR));
  } else if (grade === 'good') {
    next.interval = Math.max(base + 1, Math.round(base * s.ease));
  } else {
    next.ease = s.ease + 0.15;
    next.interval = Math.max(base + 1, Math.round(base * s.ease * EASY_BONUS));
  }
  next.due = now + next.interval * DAY;
  return next;
}

/** What each button will do, so the labels can say it before you commit. */
export function previewIntervals(prev: SrsState | undefined, now = Date.now()): Record<Grade, string> {
  const grades: Grade[] = ['again', 'hard', 'good', 'easy'];
  const out = {} as Record<Grade, string>;
  for (const g of grades) {
    const s = review(prev, g, now);
    out[g] = formatDelay(s.due - now);
  }
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

/** Is this card due now? No state means brand new, which counts as due. */
export function isDue(state: SrsState | undefined, now = Date.now()): boolean {
  return !state || state.due <= now;
}

/** New cards have never been graded. */
export function isNew(state: SrsState | undefined): boolean {
  return !state || state.reps === 0;
}

export function phaseOf(state: SrsState | undefined): 'new' | 'learning' | 'review' {
  if (isNew(state)) return 'new';
  const p = normalise(state, Date.now()).phase;
  return p === 'review' ? 'review' : 'learning';
}
