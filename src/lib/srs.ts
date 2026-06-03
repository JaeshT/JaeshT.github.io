// SM-2 spaced repetition. A 4-button UI (again/hard/good/easy) maps onto SM-2 quality.
// State is the small per-card object in db.ts; content stays pure.

import type { SrsState } from './db';

export type Grade = 'again' | 'hard' | 'good' | 'easy';

const QUALITY: Record<Grade, number> = { again: 2, hard: 3, good: 4, easy: 5 };
const DAY_MS = 24 * 60 * 60 * 1000;

export function freshState(now = Date.now()): SrsState {
  return { ease: 2.5, interval: 0, reps: 0, due: now, lastReview: 0 };
}

/** Apply a review grade, returning the next SM-2 state. */
export function review(prev: SrsState | undefined, grade: Grade, now = Date.now()): SrsState {
  const s = prev ?? freshState(now);
  const q = QUALITY[grade];

  let { ease, interval, reps } = s;

  if (q < 3) {
    // lapse — reset reps, short relearn interval
    reps = 0;
    interval = 1;
  } else {
    reps += 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else interval = Math.round(interval * ease);
  }

  // ease factor update (SM-2), floored at 1.3
  ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  return {
    ease,
    interval,
    reps,
    due: now + interval * DAY_MS,
    lastReview: now,
  };
}

/** Is this card due for review now? (no state = brand new = due) */
export function isDue(state: SrsState | undefined, now = Date.now()): boolean {
  return !state || state.due <= now;
}
