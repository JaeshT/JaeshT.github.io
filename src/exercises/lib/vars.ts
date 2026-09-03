// The variable layer: what makes an exercise a question rather than an answer you have memorised.
//
// THE PROBLEM THIS SOLVES
//
// Every exercise here is driven by a handful of numbers. Once you have worked the inventory
// write-down through at $50, the second attempt is recall, not reasoning: you remember that net
// income falls 30 and cash rises 20. The exercise has stopped teaching and started testing whether
// you can remember what it taught. Changing the figures fixes that — but only if EVERY number
// downstream moves with them, including the answer key, the near-miss diagnostics and the worked
// solution. A variant with a stale answer key is worse than no variant at all, because it marks a
// correct learner wrong.
//
// So the numbers cannot be hand-typed constants that happen to agree. The RELATIONSHIP has to be
// declared, and the constants have to be checkable against it.
//
// THE SHAPE, WHICH IS THE ONE THE GRID ALREADY USES
//
// A grid row declares `perShock` (the coefficient) alongside `delta` (the authored number), and the
// gate asserts the two agree. Authoring errors surface at build time instead of in front of a
// learner. This file generalises that to every format:
//
//   - `vars` are the free numbers, each with the set of values it may take. The FIRST value in the
//     domain is the authored default, so variant 0 reproduces exactly what the author wrote.
//   - `derived` are the intermediate quantities worth naming once: enterprise value, the tax shield.
//   - anywhere a number is authored, an optional `*Expr` twin declares how that number is built.
//     The literal stays. The gate evaluates the expression at the defaults and fails if it does not
//     reproduce the literal.
//
// Text gets the same treatment through `{...}` interpolation, because a prompt that still says
// "$50" while the model runs at $65 is the same bug wearing different clothes.

/** An arithmetic expression over an exercise's vars and derived values. */
export type Expr = string;

export interface VarDef {
  id: string;
  /**
   * The values this may take. `domain[0]` is the authored default and is what variant 0 uses, which
   * is what guarantees a first encounter is exactly the exercise the author wrote and checked.
   *
   * Choose values that keep every downstream number clean. A 40% tax rate wants multiples of 5; a
   * share count of 150 wants prices that divide sensibly into the multiple you are aiming at.
   */
  domain: number[];
  /** For the debrief and for error messages. Not shown in the stem — the prompt says it in words. */
  label?: string;
}

export interface DerivedDef {
  id: string;
  expr: Expr;
  label?: string;
}

export type Scope = Record<string, number>;

// ---- the evaluator ----
//
// Deliberately tiny and deliberately not `eval`. Content is data; data that can execute is not data.
// Numbers, names, + - * / %, parentheses, unary minus, and four functions. No assignment, no
// property access, no calls into anything the page can see. If an expression needs more than this,
// the exercise wants a derived value with a name, not a longer line.

type Tok = { t: 'num'; v: number } | { t: 'name'; v: string } | { t: 'op'; v: string };

function lex(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === ' ' || c === '\t' || c === '\n') { i++; continue; }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < src.length && /[0-9._]/.test(src[j])) j++;
      const raw = src.slice(i, j).replace(/_/g, '');
      const n = Number(raw);
      if (Number.isNaN(n)) throw new Error(`bad number "${raw}"`);
      out.push({ t: 'num', v: n }); i = j; continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
      out.push({ t: 'name', v: src.slice(i, j) }); i = j; continue;
    }
    if ('+-*/%(),'.includes(c)) { out.push({ t: 'op', v: c }); i++; continue; }
    throw new Error(`unexpected character "${c}"`);
  }
  return out;
}

const FUNCS: Record<string, (...a: number[]) => number> = {
  min: Math.min,
  max: Math.max,
  abs: Math.abs,
  // Discounting needs it and nothing else does, which is why it is a function rather than an
  // operator: an exponent operator invites expressions nobody wants to read in a content file.
  pow: Math.pow,
  // round(x) or round(x, 2). The second form is what keeps generated figures presentable.
  round: (x, dp = 0) => {
    const f = Math.pow(10, dp);
    return Math.round(x * f) / f;
  },
};

export function evalExpr(src: Expr, scope: Scope): number {
  const toks = lex(src);
  let pos = 0;
  const peek = () => toks[pos];
  const eat = (v: string) => {
    const t = toks[pos];
    if (!t || t.t !== 'op' || t.v !== v) throw new Error(`expected "${v}" in "${src}"`);
    pos++;
  };

  function primary(): number {
    const t = peek();
    if (!t) throw new Error(`unexpected end of "${src}"`);
    if (t.t === 'num') { pos++; return t.v; }
    if (t.t === 'op' && t.v === '-') { pos++; return -primary(); }
    if (t.t === 'op' && t.v === '+') { pos++; return primary(); }
    if (t.t === 'op' && t.v === '(') { pos++; const v = sum(); eat(')'); return v; }
    if (t.t === 'name') {
      pos++;
      const next = peek();
      if (next && next.t === 'op' && next.v === '(') {
        const fn = FUNCS[t.v];
        if (!fn) throw new Error(`unknown function "${t.v}" in "${src}"`);
        pos++;
        const args: number[] = [];
        if (!(peek() && peek().t === 'op' && (peek() as { v: string }).v === ')')) {
          args.push(sum());
          while (peek() && peek().t === 'op' && (peek() as { v: string }).v === ',') { pos++; args.push(sum()); }
        }
        eat(')');
        return fn(...args);
      }
      if (!(t.v in scope)) throw new Error(`unknown name "${t.v}" in "${src}"`);
      return scope[t.v];
    }
    throw new Error(`unexpected token in "${src}"`);
  }

  function product(): number {
    let v = primary();
    for (;;) {
      const t = peek();
      if (!t || t.t !== 'op' || !'*/%'.includes(t.v)) return v;
      pos++;
      const rhs = primary();
      if ((t.v === '/' || t.v === '%') && rhs === 0) throw new Error(`division by zero in "${src}"`);
      v = t.v === '*' ? v * rhs : t.v === '/' ? v / rhs : v % rhs;
    }
  }

  function sum(): number {
    let v = product();
    for (;;) {
      const t = peek();
      if (!t || t.t !== 'op' || !'+-'.includes(t.v)) return v;
      pos++;
      v = t.v === '+' ? v + product() : v - product();
    }
  }

  const value = sum();
  if (pos !== toks.length) throw new Error(`trailing input in "${src}"`);
  if (!Number.isFinite(value)) throw new Error(`"${src}" is not finite`);
  // Kill floating-point dust at the source. Two exercises that both compute 9.000000000000002
  // should agree with each other and with the number printed on screen.
  return Math.round(value * 1e6) / 1e6;
}

/** Var picks plus every derived value, in declaration order. Derived values may use earlier ones. */
export function buildScope(picks: Scope, derived: DerivedDef[] | undefined): Scope {
  const scope: Scope = { ...picks };
  for (const d of derived ?? []) {
    if (d.id in scope) throw new Error(`derived "${d.id}" shadows a var`);
    scope[d.id] = evalExpr(d.expr, scope);
  }
  return scope;
}

// ---- text ----

/**
 * `{expr}` is replaced by the expression's value; `{expr|2}` forces two decimals.
 *
 * Forcing decimals matters more than it looks: a share price is $12.70, not $12.7, and a learner
 * who sees the latter in a stem quite reasonably wonders whether the exercise is broken.
 */
export function interp(text: string, scope: Scope): string {
  return text.replace(/\{([^{}|]+)(?:\|(\d))?\}/g, (whole, expr: string, dp?: string) => {
    let v: number;
    try { v = evalExpr(expr, scope); } catch { return whole; }
    return dp === undefined ? fmtLoose(v) : fmtFixed(v, Number(dp));
  });
}

/**
 * Up to two decimals, trailing zeros trimmed, thousands separated from 1,000 up.
 *
 * The threshold matches fmt() in grade.ts on purpose. It used to sit at 10,000, which meant an
 * interpolated $1,200m rendered as $1200m while the same figure typed by hand in the next sentence
 * read $1,200m — the sort of inconsistency that makes a learner wonder what else is broken.
 */
export function fmtLoose(n: number): string {
  const r = Math.round(n * 100) / 100;
  return Math.abs(r) >= 1000 ? r.toLocaleString('en-US') : String(r);
}

export function fmtFixed(n: number, dp: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

/**
 * Every value the expression layer touches, rounded the way money is written.
 *
 * Called on generated figures rather than on authored ones: an author who wants 12.345 can have it,
 * but a variant that produces 12.344999999999999 is a bug in this file, not a choice.
 */
export function clean(n: number, dp = 2): number {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
}
