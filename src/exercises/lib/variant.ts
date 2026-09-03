// Variants: the same exercise, different numbers.
//
// WHAT A VARIANT IS
//
// Variant 0 is the exercise at its authored figures: every var at its default, every literal in the
// file reproduced exactly. That is a guarantee, not a convention — a first encounter must be the
// problem a human wrote, read and checked — and the gate holds it to that by comparing every number
// in variant 0 against the numbers in the source. Variants above 0 draw a fresh value for each
// declared var and rebuild everything that depends on it: the amounts, the answer, the near misses,
// the worked solution, the prompt.
//
// Variant 0 goes through the same pipeline as the rest rather than short-circuiting, because prose
// carries figures too. A stem that says "{shock}" has to render as a number on a first attempt as
// much as on a fifth, and a second code path for the authored case is a second thing to keep true.
//
// WHY THE CYCLE NEVER RETURNS TO 0
//
// Once you have solved the authored version, handing it back is the failure mode this whole file
// exists to prevent. So indices above 0 cycle through the other assignments only. An exercise with
// three values for one var has variants 0, 1, 2 and then 1 again.
//
// WHAT VARIES WHERE
//
// Figures, for anything with numbers: grids through the shock they already declare, everything else
// through vars. Order, for the two judgement formats — a bucketing exercise has no figures to
// change, so its re-attempt reshuffles the tray, which is a weaker defence but an honest one, and
// the app says which of the two it is offering rather than promising numbers it cannot deliver.

import type {
  BridgeExercise, Exercise, NumericExercise, StatementGridExercise, TernaryBoardExercise,
} from './schema';
import { buildScope, clean, evalExpr, interp, type Scope } from './vars';
import { evaluateBase, evaluateTruth, withShock } from './model';

/** What a re-attempt can actually offer. The UI says this in words, so it must be honest. */
export type Variation = 'figures' | 'order' | 'none';

export function variationOf(ex: Exercise): Variation {
  if (dims(ex).length > 0) return 'figures';
  if (ex.kind === 'bucketing' || ex.kind === 'ordering' || ex.kind === 'bridge') return 'order';
  return 'none';
}

/** The dimensions a variant is drawn from: the grid's shock, then each declared var, in order. */
function dims(ex: Exercise): { id: string; domain: number[] }[] {
  const out: { id: string; domain: number[] }[] = [];
  if (ex.kind === 'statement-grid' && ex.shock?.domain && ex.shock.domain.length > 1) {
    out.push({ id: 'shock', domain: ex.shock.domain });
  }
  for (const v of ex.vars ?? []) if (v.domain.length > 1) out.push({ id: v.id, domain: v.domain });
  return out;
}

/** How many distinct sets of figures exist, counting the authored one. */
export function figureCount(ex: Exercise): number {
  return dims(ex).reduce((n, d) => n * d.domain.length, 1);
}

/**
 * Fold an arbitrary attempt number into a real variant.
 *
 * Above zero it stays above zero, so a learner who has solved the authored figures never meets them
 * again. Where there are no figures to vary the index passes straight through, because it still
 * drives the tray order.
 */
export function normaliseVariant(ex: Exercise, n: number): number {
  if (n <= 0) return 0;
  const c = figureCount(ex);
  if (c <= 1) return n;
  return ((n - 1) % (c - 1)) + 1;
}

/** Mixed-radix decomposition, so index 0 is every default and every other index is distinct. */
function pickValues(ex: Exercise, n: number): Scope {
  const picked: Scope = {};
  let rest = n;
  for (const d of dims(ex)) {
    picked[d.id] = d.domain[rest % d.domain.length];
    rest = Math.floor(rest / d.domain.length);
  }
  // Anything with a single value is not a dimension, but it is still a name prose can refer to.
  for (const v of ex.vars ?? []) if (!(v.id in picked)) picked[v.id] = v.domain[0];
  if (ex.kind === 'statement-grid' && ex.shock && picked.shock === undefined) picked.shock = ex.shock.value;
  return picked;
}

/** The values in play on a given attempt. Exported for the gate, which checks what moved. */
export function scopeFor(ex: Exercise, n: number): Scope {
  return buildScope(pickValues(ex, normaliseVariant(ex, n)), ex.derived);
}

/** The scope at the authored defaults: what every authored literal is supposed to evaluate to. */
export function defaultScope(ex: Exercise): Scope {
  return buildScope(pickValues(ex, 0), ex.derived);
}

/**
 * The exercise as it should be presented for attempt `n`.
 *
 * Pure. Same inputs, same output, every time — a learner who reloads mid-exercise must not find the
 * numbers have moved under them, and the gate must be able to check a variant it can reproduce.
 */
export function variantOf(ex: Exercise, n: number): Exercise {
  const v = normaliseVariant(ex, n);
  const picks = pickValues(ex, v);
  let out: Exercise = ex;

  // The grid already has a working mechanism for this and it is the one thing here that has been
  // proved against real content. Use it rather than a second path that could disagree with it.
  if (out.kind === 'statement-grid' && picks.shock !== undefined) {
    out = withShock(out as StatementGridExercise, picks.shock);
  }

  const scope = buildScope(picks, ex.derived);
  out = applyNumbers(out, scope);
  out = interpolate(out, scope) as Exercise;
  return { ...out, variant: v };
}

// ---- numbers ----

const figureCountOf = figureCount;

function num(expr: string | undefined, fallback: number, scope: Scope): number {
  return expr === undefined ? fallback : clean(evalExpr(expr, scope));
}

function applyNumbers(ex: Exercise, scope: Scope): Exercise {
  switch (ex.kind) {
    case 'numeric': {
      const e = ex as NumericExercise;
      return {
        ...e,
        answer: num(e.answerExpr, e.answer, scope),
        nearMisses: e.nearMisses
          // A near miss with no declared relationship cannot be trusted at new figures, and a near
          // miss that fires on the wrong mistake teaches the wrong lesson. Drop it instead.
          // Belt and braces: the gate refuses to accept a near miss with no declared relationship
          // on an exercise that varies, so in practice nothing is ever dropped here.
          ?.filter((m) => figureCountOf(e) <= 1 || m.valueExpr !== undefined)
          .map((m) => ({ ...m, value: num(m.valueExpr, m.value, scope) })),
      };
    }
    case 'bridge': {
      const e = ex as BridgeExercise;
      const items = e.items.map((i) => ({ ...i, amount: i.amountExpr === undefined ? i.amount : num(i.amountExpr, i.amount ?? 0, scope) }));
      const startValue = num(e.startValueExpr, e.startValue, scope);
      return { ...e, items, startValue, targetValue: bridgeTotal({ ...e, items, startValue }) };
    }
    case 'ternary-board': {
      const e = ex as TernaryBoardExercise;
      return {
        ...e,
        rows: e.rows.map((r) => ({ ...r, magnitude: r.magnitudeExpr === undefined ? r.magnitude : num(r.magnitudeExpr, r.magnitude ?? 0, scope) })),
      };
    }
    case 'statement-grid': {
      const e = ex as StatementGridExercise;
      if (!e.rows.some((r) => r.baseExpr !== undefined || r.deltaExpr !== undefined)) return e;

      // The learner's rows first: those are the ones an author actually writes down.
      const rows = e.rows.map((r) => (r.computed ? r : {
        ...r,
        base: num(r.baseExpr, r.base, scope),
        delta: num(r.deltaExpr, r.delta, scope),
      }));
      const rescaled: StatementGridExercise = { ...e, rows };

      // Then the subtotals, twice over: their opening value falls out of the opening model, and
      // their answer-key change falls out of a correct attempt. Leaving either to the author is how
      // a model and its own answer key end up quietly disagreeing.
      const opening = evaluateBase(rescaled);
      const truth = evaluateTruth(rescaled);
      return {
        ...rescaled,
        rows: rescaled.rows.map((r) => (r.computed
          ? { ...r, base: clean(opening[r.id]), delta: clean(truth[r.id] - opening[r.id]) }
          : r)),
      };
    }
    default:
      return ex;
  }
}

/**
 * A bridge's answer, re-derived from its own parts rather than taken on the author's word.
 *
 * Contested items count: they carry a stated convention in the stem, so the total is determinate
 * even where the item is arguable. What is excluded from SCORING and what is excluded from the
 * ARITHMETIC are two different questions, and conflating them would put the target a footnote away
 * from the number a correct learner reaches.
 */
export function bridgeTotal(ex: BridgeExercise): number {
  let n = ex.startValue;
  for (const i of ex.items) {
    if (i.role === 'out' || i.amount === undefined) continue;
    n += i.role === 'add' ? i.amount : -i.amount;
  }
  return clean(n);
}

// ---- text ----

/**
 * Keys whose strings are identifiers rather than prose. Interpolating one would be a no-op anyway,
 * since an id never contains braces; the list is here to say so out loud.
 */
const NOT_PROSE = new Set(['id', 'kind', 'module', 'tier', 'statement', 'bucket', 'emphasis', 'row', 'skills', 'unit']);

/**
 * Interpolate `{...}` through every prose string in the exercise.
 *
 * A blanket walk rather than a list of fields, because the list would be the thing that rots: add a
 * caption to a view six months from now, forget to add it here, and one string on screen quietly
 * keeps the old number. Strings with no braces come back untouched, so the walk is a no-op almost
 * everywhere.
 */
function interpolate(node: unknown, scope: Scope, key?: string): unknown {
  if (typeof node === 'string') {
    return key && (NOT_PROSE.has(key) || key.endsWith('Expr')) ? node : interp(node, scope);
  }
  if (Array.isArray(node)) return node.map((n) => interpolate(n, scope, key));
  if (node && typeof node === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(node)) out[k] = interpolate(val, scope, k);
    return out;
  }
  return node;
}

