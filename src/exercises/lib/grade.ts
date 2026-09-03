// Grading. Pure functions, no DOM, no storage, so the whole thing is testable from a script.
//
// The design rule, inherited from the debate that produced EXERCISES.md: an exercise that marks a
// right answer wrong is worse than no exercise, because trust is spent globally and earned locally.
// So every verdict here comes from arithmetic on authored values. Nothing is inferred, nothing is
// simulated, and there is no code path that can decide a defensible answer is wrong unless the
// CONTENT is wrong — which is visible while authoring, and checked by scripts/verify.mjs.

import type {
  BridgeExercise,
  BucketingExercise,
  Direction,
  Exercise,
  GridRow,
  NumericExercise,
  OrderingExercise,
  StatementGridExercise,
  TernaryBoardExercise,
} from './schema';
import { evaluate } from './model';

// ---- verdicts ----

export type Verdict =
  /** Matches the expected value outright. */
  | 'correct'
  /** Wrong against truth, but correctly derived from the learner's own upstream answers. */
  | 'consistent'
  /** Should have moved and did not. */
  | 'missed'
  /** Should not have moved and did. Over-editing is a real novice tell, so it is scored. */
  | 'false-positive'
  /** Moved, but to the wrong number. */
  | 'wrong'
  /** Handed over already filled in. Not scored either way. */
  | 'given'
  /**
   * A subtotal the model worked out from the learner's inputs. Never scored: marking it would be
   * marking the app's own arithmetic. It still appears in the debrief, because seeing that your
   * net income came out at 140 rather than 144 is the point.
   */
  | 'computed';

export interface RowResult {
  rowId: string;
  label: string;
  verdict: Verdict;
  expected: number;
  entered: number | null;
  /** Set on 'consistent': what their own upstream answers implied. */
  impliedByTheirs?: number;
  explain?: string;
  skills: string[];
  /** True for the earliest wrong row in dependency order. The one worth reading first. */
  firstBreak?: boolean;
}

export interface BalanceCheck {
  assets: number;
  liabilitiesEquity: number;
  balances: boolean;
  /** What total assets should have been. A model can balance and still be wrong. */
  expectedTotal: number;
  /** Balances, but not at the right number: the classic "I changed nothing" false pass. */
  balancesAtWrongTotal: boolean;
}

export interface GradeResult {
  /** 0-100, over rows that were actually scored. */
  score: number;
  rows: RowResult[];
  counts: Record<Verdict, number>;
  /** Per sub-skill outcome, ready to hand to a scheduler. Nothing consumes this yet. */
  skillOutcomes: { skill: string; correct: number; total: number }[];
  /** Populated when the exercise declares a balance check. */
  balance?: BalanceCheck;
  notes: string[];
}

const EPS = 1e-6;
const near = (a: number, b: number) => Math.abs(a - b) < EPS;

// ---- statement grid ----

export interface GridAnswers {
  /** Row id -> the value the learner typed in the "after" column. Absent = left untouched. */
  [rowId: string]: number | undefined;
}

/**
 * Grade a full three-statement grid.
 *
 * Two things make this fair rather than brittle:
 *
 *  1. ERROR CARRY-FORWARD. A row that declares `derive` is re-checked against the learner's own
 *     parent answers. Getting pre-tax income wrong and then computing net income correctly FROM
 *     that wrong number is a different mistake from not knowing how tax works, and it is marked as
 *     'consistent' rather than 'wrong'. This is what a human marker does.
 *  2. FIRST BREAK. Only the earliest genuinely wrong row is flagged. Downstream damage from one
 *     upstream slip is not counted eight times, and the debrief points at the row worth reading.
 *
 * Rows left untouched are read as "no change", which is the honest reading: the after column starts
 * equal to before, so not typing is an assertion that it does not move.
 */
export function gradeGrid(
  ex: StatementGridExercise,
  answers: GridAnswers,
  prefilled: Set<string> = new Set(),
): GradeResult {
  const byId = new Map(ex.rows.map((r) => [r.id, r]));

  /** What the learner asserts a row's after-value is: what they typed, else the untouched base. */
  const entered = (row: GridRow): number => {
    const v = answers[row.id];
    return v === undefined || Number.isNaN(v) ? row.base : v;
  };

  const results: RowResult[] = [];
  const counts: Record<Verdict, number> = {
    correct: 0,
    consistent: 0,
    missed: 0,
    'false-positive': 0,
    wrong: 0,
    given: 0,
    computed: 0,
  };
  // Every value on screen, including the subtotals the model filled in. The UI renders from the
  // same call, so what was marked is exactly what the learner saw.
  const live = evaluate(ex, answers);

  for (const row of ex.rows) {
    const expected = row.base + row.delta;
    const typed = answers[row.id];
    const value = entered(row);
    const skills = rowSkills(ex, row);

    if (row.computed) {
      results.push({
        rowId: row.id, label: row.label, verdict: 'computed',
        expected, entered: live[row.id], explain: row.explain, skills,
      });
      counts.computed++;
      continue;
    }

    if (prefilled.has(row.id)) {
      results.push({ rowId: row.id, label: row.label, verdict: 'given', expected, entered: value, explain: row.explain, skills });
      counts.given++;
      continue;
    }

    let verdict: Verdict;
    let impliedByTheirs: number | undefined;

    // Order matters, and it changed once subtotals became the model's job.
    //
    // "Left at its opening value" is checked BEFORE carry-forward. The after column arrives
    // pre-populated with the opening numbers, so a learner who submits without touching anything
    // sends a full set of values; without this ordering, any row that happens to agree with its own
    // derivation would earn half credit for doing nothing. Leaving a line at its opening value is
    // an assertion that it does not move, and on a line that does move that is a miss.
    //
    // Propagation is still rewarded, in two places: subtotals are computed from the learner's own
    // inputs and never marked at all, and an input row they actually moved to a number that follows
    // from their own upstream still earns 'consistent' below.
    // Derive from the LIVE model, not from the raw answer map. Subtotals are computed, so a
    // parent's value is whatever the learner's own inputs make it — reading the answer map would
    // see the untouched opening number and conclude they had got it wrong.
    const implied = deriveFrom(row, live);

    if (near(value, expected)) {
      verdict = 'correct';
    } else if (row.delta === 0) {
      // Should not have moved, and it did.
      verdict = 'false-positive';
    } else if (typed === undefined || near(value, row.base)) {
      // Should have moved, and was left where it started.
      verdict = 'missed';
    } else if (implied !== null && near(value, implied)) {
      verdict = 'consistent';
      impliedByTheirs = implied;
    } else {
      verdict = 'wrong';
    }

    counts[verdict]++;
    results.push({
      rowId: row.id,
      label: row.label,
      verdict,
      expected,
      entered: typed === undefined ? null : value,
      impliedByTheirs,
      explain: row.explain,
      skills,
    });
  }

  // The earliest row that is genuinely wrong, in authored order. Authored order is dependency order
  // by construction: a statement reads top to bottom, and the verifier enforces that parents are
  // declared above their children.
  const firstBad = results.find((r) => r.verdict === 'wrong' || r.verdict === 'missed' || r.verdict === 'false-positive');
  if (firstBad) firstBad.firstBreak = true;

  // Scoring is over the lines that MOVE, less a penalty for lines you moved that should not have.
  //
  // The obvious alternative — score every row equally — is badly broken once subtotals are
  // calculated for you: a grid can have four moving lines and thirteen that stay put, so a learner
  // who touches nothing scores 76% for doing nothing at all. Here, doing nothing scores zero,
  // finding all four scores 100, and each spurious edit costs one find.
  const movers = ex.rows.filter((r) => r.delta !== 0 && !r.computed && !prefilled.has(r.id));
  const moverIds = new Set(movers.map((r) => r.id));
  const found = results.reduce(
    (n, r) => n + (moverIds.has(r.rowId) ? (r.verdict === 'correct' ? 1 : r.verdict === 'consistent' ? 0.5 : 0) : 0),
    0,
  );
  const spurious = counts['false-positive'];
  const score = movers.length
    ? Math.max(0, Math.min(100, Math.round(((found - spurious) / movers.length) * 100)))
    : 0;

  const notes: string[] = [];
  notes.push(
    `${found === Math.floor(found) ? found : found.toFixed(1)} of ${movers.length} moving line${movers.length === 1 ? '' : 's'} found` +
      (spurious > 0 ? `, less ${spurious} line${spurious === 1 ? '' : 's'} you moved that should not have.` : '.'),
  );
  if (counts['false-positive'] > 0) {
    notes.push('Changing too much is as wrong as changing too little: an interviewer notices both.');
  }
  if (counts.consistent > 0) {
    notes.push(
      `${counts.consistent} line${counts.consistent === 1 ? '' : 's'} followed correctly from your own earlier numbers. Half credit: the method was right, the input was not.`,
    );
  }

  let balance: GradeResult['balance'];
  if (ex.balance) {
    const sum = (ids: string[]) => ids.reduce((n, id) => n + (live[id] ?? 0), 0);
    const assets = sum(ex.balance.assets);
    const le = sum(ex.balance.liabilitiesEquity);
    const expectedTotal = ex.balance.assets.reduce((n, id) => {
      const r = byId.get(id);
      return n + (r ? r.base + r.delta : 0);
    }, 0);
    const balances = near(assets, le);
    balance = {
      assets, liabilitiesEquity: le, balances, expectedTotal,
      balancesAtWrongTotal: balances && !near(assets, expectedTotal),
    };
    if (!balances) {
      notes.push(`Your balance sheet is out by ${fmt(assets - le)}. Assets ${fmt(assets)} against ${fmt(le)}.`);
    } else if (balance.balancesAtWrongTotal) {
      // Leaving the balance sheet untouched balances trivially, at last year's numbers. Calling
      // that a pass would teach exactly the wrong lesson.
      notes.push(`Your balance sheet balances, but at ${fmt(assets)} rather than ${fmt(expectedTotal)}. Balancing is necessary, not sufficient: an untouched balance sheet balances too.`);
    }
  }

  return { score, rows: results, counts, skillOutcomes: rollUpSkills(results), balance, notes };
}

/** Recompute a row from the learner's own model. Null when the row declares no derivation. */
function deriveFrom(row: GridRow, live: Record<string, number>): number | null {
  if (!row.derive) return null;
  let total = 0;
  for (const p of row.derive.parents) {
    const v = live[p.row];
    if (v === undefined) return null;
    total += p.sign * v;
  }
  if (row.derive.times !== undefined) total *= row.derive.times;
  if (row.derive.offset !== undefined) total += row.derive.offset;
  return Math.round(total * 100) / 100;
}

// ---- ternary board ----

export interface TernaryAnswers {
  [rowId: string]: { direction?: Direction; magnitude?: number };
}

/**
 * Grade a direction board. Each row is an enum comparison, so the grader cannot be ambiguous.
 * Rows marked `contested` are shown in the debrief and excluded from the score, because a format
 * that guesses at genuinely arguable items teaches the learner to distrust the ones it gets right.
 */
export function gradeTernary(ex: TernaryBoardExercise, answers: TernaryAnswers): GradeResult {
  const results: RowResult[] = [];
  const counts: Record<Verdict, number> = {
    correct: 0, consistent: 0, missed: 0, 'false-positive': 0, wrong: 0, given: 0, computed: 0,
  };

  for (const row of ex.rows) {
    const a = answers[row.id] ?? {};
    const skills = ex.skills;

    if (row.contested) {
      results.push({ rowId: row.id, label: row.label, verdict: 'given', expected: 0, entered: null, explain: row.explain, skills });
      counts.given++;
      continue;
    }

    let verdict: Verdict;
    if (a.direction === undefined) {
      verdict = 'missed';
    } else if (a.direction !== row.direction) {
      // Saying a line moves when it does not is the over-editing tell again, so it is named as such.
      verdict = row.direction === 'none' ? 'false-positive' : 'wrong';
    } else if (row.requireMagnitude && row.magnitude !== undefined) {
      verdict = a.magnitude !== undefined && near(a.magnitude, row.magnitude) ? 'correct' : 'wrong';
    } else {
      verdict = 'correct';
    }

    counts[verdict]++;
    results.push({
      rowId: row.id,
      label: row.label,
      verdict,
      expected: row.magnitude ?? 0,
      entered: a.magnitude ?? null,
      explain: row.explain,
      skills,
    });
  }

  // Scored the same way as the grid and the bridge: over the lines that MOVE, less a penalty for
  // lines you said moved that do not. Scoring every row equally is gameable on a board whose lesson
  // is that most things stay put — marking 'no change' down the whole list scored well over half.
  // The no-change rows still matter, because calling one of them a mover costs you a find.
  const movers = ex.rows.filter((r) => r.direction !== 'none' && !r.contested);
  const moverIds = new Set(movers.map((r) => r.id));
  const found = results.filter((r) => moverIds.has(r.rowId) && r.verdict === 'correct').length;
  const spurious = counts['false-positive'];
  const score = movers.length
    ? Math.max(0, Math.min(100, Math.round(((found - spurious) / movers.length) * 100)))
    : 0;

  const notes: string[] = [];
  notes.push(`${found} of ${movers.length} moving line${movers.length === 1 ? '' : 's'} called correctly` + (spurious > 0 ? `, less ${spurious} you said moved that do not.` : '.'));
  if (spurious > 0) {
    notes.push('Knowing what stays put is half the question: an interviewer hears both mistakes.');
  }
  const contested = results.filter((r) => r.verdict === 'given').length;
  if (contested > 0) {
    notes.push(`${contested} line${contested === 1 ? ' is' : 's are'} genuinely arguable and were left out of the score.`);
  }

  return { score, rows: results, counts, skillOutcomes: rollUpSkills(results), notes };
}

// ---- shared ----

export function gradeExercise(
  ex: Exercise,
  answers: unknown,
  prefilled?: Set<string>,
): GradeResult {
  switch (ex.kind) {
    case 'statement-grid': return gradeGrid(ex, answers as GridAnswers, prefilled);
    case 'ternary-board': return gradeTernary(ex, answers as TernaryAnswers);
    case 'bridge': return gradeBridge(ex, answers as BridgeAnswers);
    case 'numeric': return gradeNumeric(ex, answers as NumericAnswer);
    case 'bucketing': return gradeBucketing(ex, answers as BucketAnswers);
    case 'ordering': return gradeOrdering(ex, answers as OrderAnswer);
  }
}

/**
 * A row's sub-skills: what the author declared, else a single per-statement linkage skill.
 *
 * The fallback used to hand every untagged row all of the exercise's tags for that statement,
 * which diluted the specific ones: a tagged tax row would be averaged in with every other income
 * statement line and "is-tax-effect 7/8" would tell you nothing. One generic linkage skill per
 * statement keeps the authored tags sharp and still says something useful about the rest.
 */
function rowSkills(_ex: StatementGridExercise, row: GridRow): string[] {
  if (row.skills && row.skills.length) return row.skills;
  return [`${row.statement}-linkage`];
}

/** One outcome per sub-skill, which is the unit a scheduler would consume. */
function rollUpSkills(rows: RowResult[]): { skill: string; correct: number; total: number }[] {
  const map = new Map<string, { correct: number; total: number }>();
  for (const r of rows) {
    if (r.verdict === 'given' || r.verdict === 'computed') continue;
    for (const s of r.skills) {
      const cur = map.get(s) ?? { correct: 0, total: 0 };
      cur.total++;
      if (r.verdict === 'correct' || r.verdict === 'consistent') cur.correct++;
      map.set(s, cur);
    }
  }
  return [...map.entries()].map(([skill, v]) => ({ skill, ...v })).sort((a, b) => a.skill.localeCompare(b.skill));
}

export function fmt(n: number): string {
  const s = Math.abs(n) >= 1000 ? Math.round(n).toLocaleString('en-US') : String(Math.round(n * 100) / 100);
  return (n < 0 ? '(' + s.replace('-', '') + ')' : s);
}

// ---- bridge ----

export interface BridgeAnswers {
  /** Item id -> what the learner did with it. Absent means left in the tray. */
  picks: Record<string, 'add' | 'subtract' | undefined>;
  total?: number;
}

/**
 * Grade a bridge. Three independent checks per item — did you include it, which way, and (when the
 * exercise carries amounts) does the total come out. Set comparison, so the grader cannot be
 * ambiguous, and leaving a trap in the tray is scored as getting it right rather than ignored.
 */
export function gradeBridge(ex: BridgeExercise, answers: BridgeAnswers): GradeResult {
  const results: RowResult[] = [];
  const counts: Record<Verdict, number> = {
    correct: 0, consistent: 0, missed: 0, 'false-positive': 0, wrong: 0, given: 0, computed: 0,
  };

  for (const item of ex.items) {
    const pick = answers.picks[item.id];
    let verdict: Verdict;
    if (item.contested) {
      verdict = 'given';
    } else if (item.role === 'out') {
      verdict = pick === undefined ? 'correct' : 'false-positive';
    } else if (pick === undefined) {
      verdict = 'missed';
    } else {
      verdict = pick === item.role ? 'correct' : 'wrong';
    }
    counts[verdict]++;
    results.push({
      rowId: item.id,
      label: item.label,
      verdict,
      expected: item.amount ?? 0,
      entered: null,
      explain: item.explain,
      skills: ex.skills,
    });
  }

  const firstBad = results.find((r) => r.verdict !== 'correct');
  if (firstBad) firstBad.firstBreak = true;

  // Scored over the items that BELONG, less a penalty for traps taken — the same shape as the
  // grid. Scoring every item equally rewards inaction: a heavily trapped bridge is mostly items
  // to leave alone, so a learner who assembles nothing scores well into the thirties for it.
  const belongs = ex.items.filter((i) => i.role !== 'out' && !i.contested);
  const placed = belongs.filter((i) => answers.picks[i.id] === i.role).length;
  const trapsTaken = counts['false-positive'];
  let score = belongs.length
    ? Math.max(0, Math.min(100, Math.round(((placed - trapsTaken) / belongs.length) * 100)))
    : 0;

  const notes: string[] = [];
  const traps = ex.items.filter((i) => i.role === 'out' && !i.contested).length;
  notes.push(`${placed} of ${belongs.length} item${belongs.length === 1 ? '' : 's'} placed correctly` + (trapsTaken > 0 ? `, less ${trapsTaken} that do not belong.` : '.'));
  if (trapsTaken > 0) {
    notes.push(`${trapsTaken} of the ${traps} item${traps === 1 ? '' : 's'} you added do not belong in this bridge. Knowing what to leave out is most of the skill.`);
  }

  if (ex.requireTotal) {
    const tol = ex.tolerance ?? 0.5;
    const ok = answers.total !== undefined && Math.abs(answers.total - ex.targetValue) <= tol;
    // The total is one more item's worth of credit, so assembly still dominates the score.
    score = Math.round((score * belongs.length + (ok ? 100 : 0)) / (belongs.length + 1));
    notes.push(ok
      ? `${ex.targetLabel} of ${fmt(ex.targetValue)} is right.`
      : `${ex.targetLabel} should be ${fmt(ex.targetValue)}${answers.total !== undefined ? `, you put ${fmt(answers.total)}` : ', and you did not give one'}.`);
  }

  return { score, rows: results, counts, skillOutcomes: rollUpSkills(results), notes };
}

// ---- numeric ----

export interface NumericAnswer {
  value?: number;
}

/** One number against a tolerance, with authored near-misses doing the teaching. */
export function gradeNumeric(ex: NumericExercise, answer: NumericAnswer): GradeResult {
  const tol = ex.tolerance ?? Math.max(0.01, Math.abs(ex.answer) * 0.005);
  const given = answer.value;
  const ok = given !== undefined && Math.abs(given - ex.answer) <= tol;

  const counts: Record<Verdict, number> = {
    correct: ok ? 1 : 0, consistent: 0, missed: given === undefined ? 1 : 0,
    'false-positive': 0, wrong: !ok && given !== undefined ? 1 : 0, given: 0, computed: 0,
  };

  const notes: string[] = [];
  if (!ok && given !== undefined) {
    // The specific wrong answer usually names the specific mistake. Say which one.
    //
    // Sometimes two different mistakes produce the same number, and which of them you made is not
    // something the app can know. Picking one and stating it confidently is the worst option: it
    // tells half the learners who land there something untrue about their own reasoning. Say both,
    // and let them recognise which one is theirs.
    const hits = ex.nearMisses?.filter((n) => Math.abs(given - n.value) <= tol) ?? [];
    if (hits.length > 1) notes.push(`Two different mistakes land on ${fmt(given)}. One of these is yours.`);
    if (hits.length === 0) notes.push(`You put ${fmt(given)}. The answer is ${fmt(ex.answer)}${ex.unit ?? ''}.`);
    for (const h of hits) notes.push(h.note);
  }
  for (const line of ex.working ?? []) notes.push(line);

  return {
    score: ok ? 100 : 0,
    rows: [{
      rowId: 'answer',
      label: ex.question,
      verdict: ok ? 'correct' : given === undefined ? 'missed' : 'wrong',
      expected: ex.answer,
      entered: given ?? null,
      skills: ex.skills,
      firstBreak: !ok,
    }],
    counts,
    skillOutcomes: rollUpSkills([{ rowId: 'answer', label: '', verdict: ok ? 'correct' : 'wrong', expected: 0, entered: null, skills: ex.skills }]),
    notes,
  };
}

// ---- bucketing ----

export interface BucketAnswers {
  [itemId: string]: string | undefined;
}

/** Per-item bucket equality. Exact, and honest about ambiguity via the lenient middle bucket. */
export function gradeBucketing(ex: BucketingExercise, answers: BucketAnswers): GradeResult {
  const lenient = new Set(ex.buckets.filter((b) => b.lenient).map((b) => b.id));
  const label = (id: string | undefined) => ex.buckets.find((b) => b.id === id)?.label ?? '—';

  const results: RowResult[] = [];
  const counts: Record<Verdict, number> = {
    correct: 0, consistent: 0, missed: 0, 'false-positive': 0, wrong: 0, given: 0, computed: 0,
  };

  for (const item of ex.items) {
    const put = answers[item.id];
    let verdict: Verdict;
    if (item.contested) verdict = 'given';
    else if (put === undefined) verdict = 'missed';
    else if (put === item.bucket) verdict = 'correct';
    // Landing in the forgiving middle when the answer was an outer bucket is a near miss, not a
    // blunder: the learner has recognised the method is relevant but misjudged how much weight it
    // carries. Half credit says that without pretending they were right.
    else if (lenient.has(put) || lenient.has(item.bucket)) verdict = 'consistent';
    else verdict = 'wrong';
    counts[verdict]++;
    results.push({
      rowId: item.id,
      label: item.label,
      verdict,
      expected: 0,
      entered: null,
      explain: `${item.explain ?? ''}${item.explain ? ' ' : ''}Belongs in ${label(item.bucket)}${put && put !== item.bucket ? `, you put it in ${label(put)}.` : '.'}`,
      skills: ex.skills,
    });
  }

  const firstBad = results.find((r) => r.verdict !== 'correct');
  if (firstBad) firstBad.firstBreak = true;

  const graded = results.filter((r) => r.verdict !== 'given');
  const earned = graded.reduce((n, r) => n + (r.verdict === 'correct' ? 1 : r.verdict === 'consistent' ? 0.5 : 0), 0);
  const score = graded.length ? Math.round((earned / graded.length) * 100) : 0;

  const notes: string[] = [];
  if (counts.given > 0) {
    notes.push(`${counts.given} item${counts.given === 1 ? ' is' : 's are'} genuinely arguable and were left out of the score.`);
  }
  if (counts.consistent > 0) {
    notes.push(`${counts.consistent} item${counts.consistent === 1 ? '' : 's'} landed one bucket out. Half credit: you spotted that it matters, but not how much.`);
  }
  return { score, rows: results, counts, skillOutcomes: rollUpSkills(results), notes };
}

// ---- ordering ----

export interface OrderAnswer {
  /** Item ids, top first. */
  order: string[];
}

/**
 * Scored by Kendall tau distance: how many adjacent swaps would fix it, as a fraction of the worst
 * possible. A learner whose mental model is nearly right scores nearly full, which matters here
 * because "nearly right" is the normal state of a capital structure question.
 */
export function gradeOrdering(ex: OrderingExercise, answer: OrderAnswer): GradeResult {
  const rankOf = new Map(ex.items.map((i) => [i.id, i.rank]));
  const given = answer.order.filter((id) => rankOf.has(id));
  const n = given.length;

  let discordant = 0;
  let comparable = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = rankOf.get(given[i])!;
      const b = rankOf.get(given[j])!;
      if (a === b) continue; // a genuine tie: either order is fine
      comparable++;
      if (a > b) discordant++;
    }
  }
  const score = n < ex.items.length ? 0 : comparable === 0 ? 100 : Math.round((1 - discordant / comparable) * 100);

  const correct = [...ex.items].sort((a, b) => a.rank - b.rank);
  const results: RowResult[] = given.map((id, idx) => {
    const item = ex.items.find((i) => i.id === id)!;
    const shouldBe = correct.findIndex((c) => c.rank === item.rank);
    const misplaced = Math.abs(idx - shouldBe) > 0 && correct[idx]?.rank !== item.rank;
    return {
      rowId: id,
      label: `${idx + 1}. ${item.label}`,
      verdict: misplaced ? 'wrong' : 'correct',
      expected: shouldBe + 1,
      entered: idx + 1,
      explain: item.explain,
      skills: ex.skills,
    };
  });

  const counts: Record<Verdict, number> = {
    correct: results.filter((r) => r.verdict === 'correct').length,
    wrong: results.filter((r) => r.verdict === 'wrong').length,
    consistent: 0, missed: n < ex.items.length ? ex.items.length - n : 0,
    'false-positive': 0, given: 0, computed: 0,
  };
  const firstBad = results.find((r) => r.verdict !== 'correct');
  if (firstBad) firstBad.firstBreak = true;

  const notes: string[] = [];
  if (n < ex.items.length) notes.push('Place every item before submitting.');
  else if (discordant > 0) notes.push(`${discordant} pair${discordant === 1 ? ' is' : 's are'} the wrong way round.`);
  notes.push('Correct order: ' + correct.map((c) => c.label).join(' → '));

  return { score, rows: results, counts, skillOutcomes: rollUpSkills(results), notes };
}
