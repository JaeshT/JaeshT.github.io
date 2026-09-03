// The live model: given the learner's inputs, what does the whole statement set currently say?
//
// This exists so the UI and the grader cannot disagree. Both call `evaluate()`. A subtotal shown on
// screen is by construction the same number the grader sees, which removes a whole class of bug
// where the model looks right and marks wrong.
//
// Forward evaluation, one pass, in authored order. Authored order is dependency order — the gate
// enforces that parents appear above their children — so a single top-to-bottom sweep is enough and
// there is no solver, no iteration and no circularity. That restriction is deliberate: it is what
// keeps this file short enough to trust.

import type { GridRow, StatementGridExercise } from './schema';

export type Inputs = Record<string, number | undefined>;

/**
 * Values for every row: the learner's own where they typed one, the model's arithmetic where the
 * row is computed, and the opening value where they left an input alone.
 */
export function evaluate(ex: StatementGridExercise, inputs: Inputs): Record<string, number> {
  const out: Record<string, number> = {};
  for (const row of ex.rows) {
    if (row.computed && row.derive) {
      let total = 0;
      for (const p of row.derive.parents) total += p.sign * (out[p.row] ?? 0);
      if (row.derive.times !== undefined) total *= row.derive.times;
      if (row.derive.offset !== undefined) total += row.derive.offset;
      out[row.id] = round(total);
    } else {
      const typed = inputs[row.id];
      out[row.id] = typed === undefined || Number.isNaN(typed) ? row.base : typed;
    }
  }
  return out;
}

/** The same evaluation applied to the opening model, so the "before" column is self-consistent. */
export function evaluateBase(ex: StatementGridExercise): Record<string, number> {
  return evaluate(ex, {});
}

/** What a fully correct attempt looks like. Used by the gate, and by the debrief. */
export function evaluateTruth(ex: StatementGridExercise): Record<string, number> {
  const inputs: Inputs = {};
  for (const row of ex.rows) if (!row.computed) inputs[row.id] = row.base + row.delta;
  return evaluate(ex, inputs);
}

/** Rows the learner is actually responsible for. Computed subtotals are the model's job. */
export function inputRows(ex: StatementGridExercise): GridRow[] {
  return ex.rows.filter((r) => !r.computed);
}

/**
 * Apply a shock value to an exercise, rewriting every delta that declares a coefficient.
 *
 * Nothing calls this with anything but the authored default today. It is the entire mechanism
 * behind future randomisation: pick a value from `shock.domain`, pass it here, and the exercise
 * is a fresh question with a consistent answer key. Kept beside `evaluate` so the two stay honest
 * about each other.
 */
export function withShock(ex: StatementGridExercise, value: number): StatementGridExercise {
  if (!ex.shock) return ex;

  // Step one: rescale the rows the learner types, using their declared coefficients.
  const rescaled: StatementGridExercise = {
    ...ex,
    shock: { ...ex.shock, value },
    rows: ex.rows.map((r) => (r.perShock === undefined ? r : { ...r, delta: round(r.perShock * value) })),
  };

  // Step two, and the part that is easy to forget: subtotals carry an answer-key delta too, and
  // theirs does not scale by a coefficient — it falls out of the arithmetic. Left alone they keep
  // the delta for the OLD shock value, so the model and the answer key quietly disagree and a
  // correct learner gets marked wrong. Re-derive them from the rescaled inputs instead.
  const truth = evaluateTruth(rescaled);
  return {
    ...rescaled,
    rows: rescaled.rows.map((r) => (r.computed ? { ...r, delta: round(truth[r.id] - r.base) } : r)),
  };
}

/** Two decimal places, so floating point noise never shows up in a cell or a verdict. */
function round(n: number): number {
  return Math.round(n * 100) / 100;
}
