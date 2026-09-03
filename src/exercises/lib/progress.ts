// What you have already solved, and therefore which figures you get next.
//
// Local to the browser and deliberately so: this project has no accounts, and the record it keeps
// is one line per exercise. When it merges into tewess.com this is the file that gets replaced by
// the real store — everything above it asks the same three questions, so nothing else moves.
//
// The rule that makes the whole variant idea work: an exercise you have SOLVED never hands you the
// same figures again. Not solved yet, and you get the same ones back, because the point of a second
// attempt at a problem you got wrong is to get that problem right.

import type { Exercise } from './schema';
import { normaliseVariant } from './variant';

const KEY = 'ib-exercise-progress';

/**
 * What counts as solved.
 *
 * Not 100. A twelve-row grid with one slip is a learner who understands the exercise, and making
 * them repeat identical figures until they are perfect is how you train people to memorise an
 * answer key. Numeric exercises score 0 or 100 anyway, so this only ever bites on the multi-part
 * formats, which is where it should.
 */
export const SOLVED_AT = 80;

export interface ExerciseRecord {
  /** Best score across every variant. */
  best: number;
  attempts: number;
  /** Variant indices solved, so a failed variant comes back around. */
  solved: number[];
  lastAt: number;
}

type Store = Record<string, ExerciseRecord>;

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    // Private browsing, a full quota, a corrupt value. A lost progress record is not worth an
    // error screen in front of someone who came here to practise.
    return {};
  }
}

function write(store: Store): void {
  try { localStorage.setItem(KEY, JSON.stringify(store)); } catch { /* see read() */ }
}

export function progressFor(id: string): ExerciseRecord | undefined {
  return read()[id];
}

export function allProgress(): Store {
  return read();
}

export function isSolved(id: string): boolean {
  return (read()[id]?.solved.length ?? 0) > 0;
}

/** Record one graded attempt. Returns the updated record so a caller can render it immediately. */
export function recordAttempt(id: string, variant: number, score: number): ExerciseRecord {
  const store = read();
  const cur = store[id] ?? { best: 0, attempts: 0, solved: [], lastAt: 0 };
  const next: ExerciseRecord = {
    best: Math.max(cur.best, score),
    attempts: cur.attempts + 1,
    solved: score >= SOLVED_AT && !cur.solved.includes(variant) ? [...cur.solved, variant].sort((a, b) => a - b) : cur.solved,
    lastAt: Date.now(),
  };
  store[id] = next;
  write(store);
  return next;
}

/**
 * Which variant to open next: the lowest one not yet solved.
 *
 * So a first visit is always the authored exercise, a solve moves you on to fresh figures, and a
 * variant you fluffed is still waiting for you after you have been round the others.
 */
export function nextVariantFor(ex: Exercise): number {
  const solved = read()[ex.id]?.solved ?? [];
  if (solved.length === 0) return 0;
  const seen = new Set(solved);
  for (let n = 0; n < 64; n++) {
    if (!seen.has(normaliseVariant(ex, n))) return n;
  }
  return solved.length;
}

/** Testing and the reset button. */
export function clearProgress(): void {
  try { localStorage.removeItem(KEY); } catch { /* see read() */ }
}
