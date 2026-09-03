// The content contract for interactive exercises.
//
// Deliberately shaped like tewess.com's `src/lib/schema.ts`: same Module and Tier axes, same
// "content is DATA, not code" rule, same convention that an exercise is a plain JSON-able object
// authored by hand. That is what makes merging the two projects later a matter of moving files
// rather than rewriting a model.
//
// One exercise = one thing you DO. It is not a flashcard and does not replace one. See FADE below
// for how difficulty is expressed, and SKILLS for the seam to spaced repetition.

import type { DerivedDef, Expr, VarDef } from './vars';
export type { DerivedDef, Expr, VarDef } from './vars';

export type Tier = 'easy' | 'medium' | 'hard';
export const TIERS: Tier[] = ['easy', 'medium', 'hard'];

export type Module =
  | 'accounting'
  | 'ev-eqv'
  | 'valuation'
  | 'dcf'
  | 'ma'
  | 'lbo'
  | 'markets';

export const MODULE_LABEL: Record<Module, string> = {
  accounting: 'Accounting',
  'ev-eqv': 'Equity value & enterprise value',
  valuation: 'Valuation',
  dcf: 'DCF',
  ma: 'M&A',
  lbo: 'LBO',
  markets: 'Capital markets',
};

/**
 * SKILLS — the seam to spaced repetition.
 *
 * A sub-skill tag is the thing worth scheduling, not the exercise. A six-minute grid touching eight
 * sub-skills cannot carry one stability value: failing only the deferred-tax step should not
 * reschedule the whole artifact. Grading emits one outcome per tag touched (see grade.ts), which is
 * exactly the shape tewess.com's FSRS scheduler already consumes.
 *
 * Nothing in this project schedules anything yet. The tags are emitted and displayed, so that
 * wiring them up later is a matter of handing the outcomes to the scheduler.
 */
export type SkillTag = string;

// ---- Presentation: how much fidelity, and how much help ----

/**
 * Fidelity rises with tier, and only with tier. Easy stays clean and scaffolded: the numbers are
 * round, the tax rate is stated, nothing is trying to catch you out. Mess, distractors and time
 * pressure are medium-and-up features, because a novice dropped into a realistic artifact flounders
 * and quits (the expertise reversal effect cuts this way at the bottom of the range).
 */
export interface Presentation {
  /** Seconds on the clock. Absent = untimed. Reserve for medium and hard. */
  timerSeconds?: number;
  /** Show each line's opening value beside the input. Scaffolding; drop it at hard. */
  showBase?: boolean;
  /** Show a running balance-sheet check as you type. Scaffolding; drop it at hard. */
  liveBalanceCheck?: boolean;
  /** Rows that do not move, mixed in to punish over-editing. Medium and up. */
  includeDistractors?: boolean;
}

/**
 * THE SHOCK, AND THE ROUTE TO RANDOMISED NUMBERS
 *
 * Every grid exercise is driven by one number: depreciation rises by $10, inventory is written down
 * by $50. Today that number is fixed. The intent is that it is eventually drawn at random from a
 * set, so the same exercise is a fresh question every time and cannot be answered from memory.
 *
 * That is NOT switched on. What is built now is the seam:
 *
 *   - the driving number lives here, once, as `value`, with the set it could be drawn from
 *   - any row whose movement scales with it declares `perShock` (its coefficient), so the row's
 *     delta is `perShock * shock.value` rather than a hand-typed constant
 *   - the authored `delta` stays alongside it and the gate asserts the two agree, so authoring
 *     errors surface at build time rather than in front of a learner
 *
 * Turning randomisation on later is then: draw a value from `domain`, recompute every delta as
 * `perShock * value`, and leave everything else alone. No formula parser, no re-authoring.
 * Rows that do not scale linearly with the shock simply omit `perShock` and stay fixed; an
 * exercise where nothing scales is still perfectly valid.
 */
export interface Shock {
  /** What the number means, for the prompt: 'depreciation increase'. */
  label: string;
  /** The value in use. Today always the authored default. */
  value: number;
  /**
   * Values this could be drawn from, all of which must keep every derived number clean given the
   * tax rate. With a 40% rate, multiples of 5 keep the tax effect a whole number.
   */
  domain?: number[];
}

export interface ExerciseBase {
  id: string;
  module: Module;
  tier: Tier;
  title: string;
  /** The stimulus. This is where fidelity lives: messy wording, extra facts, real phrasing. */
  prompt: string;
  /**
   * Pinned conventions, stated in the stem. Mandatory wherever an answer could reasonably differ
   * by convention: without it the app marks a right answer wrong, which is the one failure that
   * destroys trust in every other verdict.
   */
  conventions?: string[];
  skills: SkillTag[];
  presentation?: Presentation;
  estSeconds?: number;
  /**
   * The free numbers behind this exercise, each with the set of values it may take. See vars.ts.
   * Declaring them is what lets the figures change on a re-attempt without the answer key going
   * stale. An exercise with no vars is still valid: it simply has nothing to vary.
   */
  vars?: VarDef[];
  /** Named intermediates, evaluated in order after the vars are picked. */
  derived?: DerivedDef[];
  /**
   * Why this exercise's figures do NOT vary. Required by the gate for anything carrying numbers and
   * no vars, so a re-attempt that hands back an identical problem is always a stated choice with a
   * reason attached, never an author who ran out of time.
   */
  fixedFigures?: string;
  /**
   * Which variant this is. Set by variantOf(), never authored: 0 (or absent) is the exercise
   * exactly as written. Views read it through seedOf() so the tray order moves with the figures.
   */
  variant?: number;
}

// ---- Primitive: statement-grid (the full model) ----

export type StatementId = 'is' | 'bs' | 'cfs';

export const STATEMENT_LABEL: Record<StatementId, string> = {
  is: 'Income statement',
  bs: 'Balance sheet',
  cfs: 'Cash flow statement',
};

/**
 * A derivation lets the grader mark a row against the learner's OWN upstream answers as well as
 * against truth. One wrong sign at the top then costs one mark instead of eight, and the feedback
 * can name the first broken row rather than the last.
 *
 * Forward evaluation only, one pass, no iteration. There is deliberately no way to express
 * circularity (interest on average debt, a cash sweep, a balancing plug that must solve). If an
 * exercise needs one of those, the author states it as a given. That restriction is what keeps this
 * a 200-line grader instead of a hand-rolled accounting engine.
 */
export interface Derivation {
  parents: { row: string; sign: 1 | -1 }[];
  /** Multiply the summed parents, e.g. 0.6 for an after-tax effect. */
  times?: number;
  /**
   * A constant added after the parents are summed: the part of this row that comes from outside
   * the model. In practice this is an opening balance — retained earnings are last year's plus this
   * year's net income, and no row in a single-period model carries "last year's".
   */
  offset?: number;
}

export interface GridRow {
  id: string;
  label: string;
  statement: StatementId;
  /** Grouping within a statement, e.g. 'Operating', 'Assets'. Presentational. */
  section?: string;
  /** Opening value before the shock. */
  base: number;
  /**
   * How the opening value is built from the exercise's vars. Only needed where the opening balance
   * sheet itself varies rather than just the event acting on it.
   */
  baseExpr?: Expr;
  /** Expected change. 0 means this row must NOT move; leaving it alone is the correct answer. */
  delta: number;
  /**
   * How this row scales with the exercise's shock: delta === perShock * shock.value. Declaring it
   * is what makes the number randomisable later. Omit for rows that do not scale (a fixed
   * write-off, a row that never moves). The gate checks it against `delta`.
   */
  perShock?: number;
  /**
   * How the change is built, for exercises whose lines are NOT linear in one number.
   *
   * A coefficient covers a whole class of question — depreciation rises by X and six lines move
   * proportionally — but it cannot express a constant term. Goodwill is the purchase price less the
   * identifiable net assets acquired: it moves one-for-one with the price and then subtracts a
   * fixed quantity, and no coefficient says that. This does, at the cost of naming the relationship
   * in full. Use the coefficient where it fits and this where it does not.
   */
  deltaExpr?: Expr;
  /**
   * A subtotal the model works out for you, exactly as a spreadsheet would. Read-only in the UI,
   * recalculated live from the learner's own inputs, and NOT scored: the app computed it, so
   * marking it would be marking its own arithmetic. Requires `derive`.
   *
   * What this leaves being tested is the thing worth testing: which lines move, and by how much.
   */
  computed?: boolean;
  /** Subtotals and totals read differently and are worth marking as such. */
  emphasis?: 'subtotal' | 'total';
  /** Enables error carry-forward for this row. */
  derive?: Derivation;
  /** Shown in the debrief. Say why the line moves, or why it does not. */
  explain?: string;
  /**
   * Sub-skills this row exercises. Falls back to the exercise's tags when absent, but authoring it
   * per row is what makes the roll-up mean something: "you can do the cash flow add-back but not
   * the tax shield" is actionable, "you got 7/10 on accounting" is not.
   */
  skills?: SkillTag[];
  /**
   * Authored default for which tiers hand this row over already filled in.
   * Read only through resolvePrefill() in fade.ts — never directly. See that file for why.
   */
  prefillAt?: Tier[];
}

export interface StatementGridExercise extends ExerciseBase {
  kind: 'statement-grid';
  /** Stated so the learner never has to guess it, at every tier. */
  taxRate: number;
  /** The one number driving the exercise. See Shock above for why it is modelled separately. */
  shock?: Shock;
  rows: GridRow[];
  /** Assets = liabilities + equity, checked from the learner's own numbers. */
  balance?: { assets: string[]; liabilitiesEquity: string[] };
}

// ---- Primitive: ternary-board (the fast one) ----

export type Direction = 'up' | 'down' | 'none';

export interface TernaryRow {
  id: string;
  label: string;
  direction: Direction;
  /** Absolute size of the move. Asked for only where requireMagnitude is set. */
  magnitude?: number;
  /**
   * How the magnitude is built from the vars. The gate checks it reproduces the authored magnitude
   * at the defaults, and separately that it stays strictly positive across the whole domain: a
   * magnitude that crosses zero means the direction flips, and the direction is authored, not
   * computed.
   */
  magnitudeExpr?: Expr;
  requireMagnitude?: boolean;
  explain?: string;
  /**
   * Reasonable people disagree. Shown and explained in the debrief, excluded from the score.
   * Only grade what is genuinely determinate.
   */
  contested?: boolean;
}

export interface TernaryBoardExercise extends ExerciseBase {
  kind: 'ternary-board';
  taxRate?: number;
  rows: TernaryRow[];
}

// ---- Primitive: bridge (signed set assembly) ----

/**
 * Build a bridge from one value to another by choosing which items belong and which way they go.
 * The natural shape for equity value to enterprise value, and for EBITDA to unlevered free cash
 * flow: both are "start here, add these, subtract those, and know what does NOT belong".
 *
 * The traps are the feature. What separates a candidate is knowing that prepaid expenses and an
 * equity-method stake are not part of the bridge, so the tray always contains items that must be
 * left in it.
 */
export interface BridgeItem {
  id: string;
  label: string;
  /** 'out' means it does not belong in the bridge at all. */
  role: 'add' | 'subtract' | 'out';
  /** Absent when the exercise only tests inclusion and sign. */
  amount?: number;
  /** How the amount is built from the vars. Checked against the authored amount at the defaults. */
  amountExpr?: Expr;
  /** Extra colour shown on the chip at medium and hard: a footnote fragment, a caveat. */
  detail?: string;
  explain?: string;
  /**
   * Reasonable people disagree. Shown and explained in the debrief, excluded from the score.
   * Only grade what is genuinely determinate: stock-based compensation as a cash-flow add-back is
   * the standing example, defended and attacked by serious people.
   */
  contested?: boolean;
}

export interface BridgeExercise extends ExerciseBase {
  kind: 'bridge';
  startLabel: string;
  startValue: number;
  startValueExpr?: Expr;
  targetLabel: string;
  /**
   * The answer, checked with a tolerance when the exercise asks for the total. Authored, and
   * re-derived from the start value and the items on every variant — the gate asserts the two agree
   * at the defaults, so an author cannot quietly disagree with their own bridge.
   */
  targetValue: number;
  /** Ask for the final number as well as the assembly. Reserve for medium and hard. */
  requireTotal?: boolean;
  tolerance?: number;
  items: BridgeItem[];
}

// ---- Primitive: numeric (tolerance scalar) ----

/**
 * One number, typed. The cheapest primitive to author and the hardest to argue with, so it carries
 * the hard tiers: recognition formats let a learner eliminate their way to an answer, and typing a
 * number does not.
 *
 * `nearMisses` is where the teaching lives. A specific wrong value maps to the specific mistake
 * that produces it, which is far more useful than "incorrect".
 */
export interface NearMiss {
  value: number;
  /**
   * How this specific wrong answer is built. Required once the exercise has vars: a near miss
   * diagnoses one particular slip, so a stale value does not merely fail to fire — it fires on the
   * wrong mistake and tells the learner something untrue.
   */
  valueExpr?: Expr;
  note: string;
}

export interface NumericExercise extends ExerciseBase {
  kind: 'numeric';
  /** Facts to work from, rendered as a small table above the input. */
  givens: { label: string; value: string }[];
  question: string;
  answer: number;
  /** How the answer is built from the vars. Checked against the authored answer at the defaults. */
  answerExpr?: Expr;
  tolerance?: number;
  unit?: string;
  nearMisses?: NearMiss[];
  /** The worked answer, shown after grading. */
  working?: string[];
}

// ---- Primitive: bucketing ----

/**
 * Sort items into named buckets. The format for judgement, which the numeric formats handle badly:
 * "which valuation method is primary here, which is supporting, which does not apply" has a
 * defensible answer without having a single arithmetic one.
 *
 * The design trick that keeps it gradable is a deliberately forgiving middle bucket. Making the
 * load-bearing distinctions the outer two, and letting the middle absorb the genuinely arguable
 * calls, means the grader is exact without pretending the subject is more settled than it is.
 */
export interface BucketDef {
  id: string;
  label: string;
  /** Marks the forgiving middle. Shown to the learner as such. */
  lenient?: boolean;
}

export interface BucketItem {
  id: string;
  label: string;
  detail?: string;
  bucket: string;
  explain?: string;
  /**
   * Reasonable people disagree. Shown and explained in the debrief, excluded from the score.
   * Only grade what is genuinely determinate: stock-based compensation as a cash-flow add-back is
   * the standing example, defended and attacked by serious people.
   */
  contested?: boolean;
}

export interface BucketingExercise extends ExerciseBase {
  kind: 'bucketing';
  /** The situation the sorting is relative to. This is where the fidelity lives. */
  scenario?: string;
  buckets: BucketDef[];
  items: BucketItem[];
}

// ---- Primitive: ordering ----

/**
 * Put items in order. Seniority in a capital structure, cost of capital, expected recovery — the
 * same list in a different order each time, which is exactly the point: a learner who thinks
 * seniority and cost are the same ranking is wrong in a way no multiple-choice question catches.
 *
 * Scored by how many adjacent swaps it would take to fix, so a nearly-right mental model scores
 * nearly right. Items sharing a `rank` may appear in any relative order without penalty, because
 * some things genuinely tie.
 */
export interface OrderItem {
  id: string;
  label: string;
  detail?: string;
  /** Lower comes first. Equal values tie and cost nothing to swap. */
  rank: number;
  explain?: string;
}

export interface OrderingExercise extends ExerciseBase {
  kind: 'ordering';
  /** What "first" means here, e.g. 'Most senior first'. */
  topLabel: string;
  bottomLabel: string;
  items: OrderItem[];
}

export type Exercise =
  | StatementGridExercise
  | TernaryBoardExercise
  | BridgeExercise
  | NumericExercise
  | BucketingExercise
  | OrderingExercise;
export type ExerciseKind = Exercise['kind'];

export const KIND_LABEL: Record<ExerciseKind, string> = {
  'statement-grid': 'Full model',
  'ternary-board': 'Direction board',
  bridge: 'Bridge builder',
  numeric: 'One number',
  bucketing: 'Sort them',
  ordering: 'Rank them',
};
