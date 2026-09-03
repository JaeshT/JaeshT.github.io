// How much of an exercise is handed over already filled in.
//
// WHY THIS IS ITS OWN FILE, AND WHY EVERYTHING GOES THROUGH IT
//
// The research finding worth building around is that ADAPTIVE fading beats fixed fading, which in
// turn beats dropping the learner into a blank problem. Adaptive means the scaffold is decided by
// what you currently retain: rows whose sub-skills are solid come pre-filled, rows whose sub-skills
// are due come empty. Difficulty stops being an authored constant and becomes an output of the
// scheduler.
//
// That needs retention data this project does not have, so today the resolver returns the AUTHORED
// default and nothing else. It is a single pure function with a single call site pattern, so the
// later change is: give it a `mastery` argument and let it override. Nothing else moves.
//
// The rule that keeps it that way: no view and no grader may read `row.prefillAt` directly. They
// ask this module. There is a check in scripts/verify.mjs that fails the build if they don't.

import type { GridRow, Tier } from './schema';

/** What the app knows about how well a sub-skill is retained. Unused today; the shape is the seam. */
export interface MasteryLookup {
  /** 0 = never met, 1 = solid. Later this comes from FSRS stability via the tewess.com store. */
  retention(skill: string): number;
}

export interface FadeContext {
  tier: Tier;
  /** Absent today. When present, it decides, and the authored default becomes a fallback. */
  mastery?: MasteryLookup;
  /** Escape hatch for the debrief screen and for testing: hand over everything, or nothing. */
  override?: 'none' | 'all';
}

/**
 * Which rows start pre-filled. Returns a Set of row ids.
 *
 * Today: the authored `prefillAt` list, which by convention scaffolds easy and empties hard.
 * Later: rows whose skills are well retained get filled regardless of tier, and rows that are due
 * get emptied regardless of tier. The signature already carries everything that needs.
 */
export function resolvePrefill(rows: GridRow[], ctx: FadeContext): Set<string> {
  if (ctx.override === 'all') return new Set(rows.map((r) => r.id));
  if (ctx.override === 'none') return new Set();

  const filled = new Set<string>();
  for (const row of rows) {
    if (row.prefillAt?.includes(ctx.tier)) filled.add(row.id);
  }

  // ---- the adaptive branch, deliberately dormant ----
  // if (ctx.mastery) {
  //   for (const row of rows) {
  //     const solid = (row.skills ?? []).every((s) => ctx.mastery!.retention(s) > 0.9);
  //     if (solid) filled.add(row.id); else filled.delete(row.id);
  //   }
  // }

  return filled;
}

/** Does this tier get the scaffolding at all? Kept here so the policy lives in one place. */
export function scaffoldDefaults(tier: Tier) {
  return {
    showBase: tier !== 'hard',
    liveBalanceCheck: tier === 'easy',
    includeDistractors: tier !== 'easy',
  };
}
