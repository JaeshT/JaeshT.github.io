// The ladder: which stages are locked, which are cleared, and how ready you actually are.
// Pure functions over the manifest + question banks + user state. No I/O, so it's testable
// and the views stay dumb.
//
// Gating rules (deliberately generous: this is a study aid, not a jail):
//   • MEDIUM opens when EASY is cleared; HARD opens when MEDIUM is cleared.
//   • The next core module opens when the previous one is fully cleared, so you finish a module
//     before starting the next. That matches the climb, where a module is a level and its three
//     tiers are its sublevels.
//   • Sector desks open once every core module has been entered.
//   • The "fit" track is never locked.
//   • Anything can be force-opened; the map records that it was opened early rather than earned.

import type { ContentIndex, ModuleRef, Question, QuestionBank, Tier } from './schema';
import { TIERS } from './schema';
import type { AttemptMap, Progress, SrsMap } from './db';
import { isDue } from './srs';

export type StageStatus = 'locked' | 'open' | 'cleared';

/** Fraction of a stage's questions you must have nailed at least once to clear it. */
export const CLEAR_THRESHOLD = 0.8;

export function stageKey(moduleId: string, tier: Tier): string {
  return `${moduleId}:${tier}`;
}

export interface Stage {
  moduleId: string;
  tier: Tier;
  key: string;
  total: number;
  nailed: number; // answered correctly at least once
  strength: number; // 0..1, decays when reviews go overdue
  status: StageStatus;
  earnedEarly: boolean; // opened by hand rather than by clearing the stage before it
}

export interface ModuleState {
  ref: ModuleRef;
  stages: Stage[];
  total: number;
  strength: number; // 0..1 across the whole module
  status: StageStatus; // cleared only when all three tiers are cleared
  ready: boolean; // has a question bank at all
}

/**
 * How solid one question is right now.
 *   never answered           -> 0
 *   nailed but review overdue -> 0.5   (you knew it; that was a while ago)
 *   nailed and fresh          -> 1
 * Missing it after claiming confidence drags it back to 0: that's the point of the Danger Zone.
 */
export function strengthOf(id: string, attempts: AttemptMap, srs: SrsMap, now = Date.now()): number {
  const a = attempts[id];
  if (!a || a.hits === 0) return 0;
  if (a.burned) return 0;
  return isDue(srs[id], now) ? 0.5 : 1;
}

function questionsFor(bank: QuestionBank | undefined, tier: Tier): Question[] {
  return bank ? bank.questions.filter((q) => q.tier === tier) : [];
}

export function buildLadder(
  index: ContentIndex,
  banks: Record<string, QuestionBank>,
  attempts: AttemptMap,
  srs: SrsMap,
  progress: Progress,
  now = Date.now(),
): ModuleState[] {
  const modules = [...index.modules].sort((a, b) => a.order - b.order);
  // Only modules that actually have questions can gate anything: an unwritten module in the
  // middle of the ladder must not wall off everything behind it.
  const core = modules.filter((m) => m.track === 'core' && (banks[m.id]?.questions.length ?? 0) > 0);

  // First pass: raw stats per stage.
  const raw = new Map<string, { stage: Stage; questions: Question[] }>();
  for (const ref of modules) {
    const bank = banks[ref.id];
    for (const tier of TIERS) {
      const questions = questionsFor(bank, tier);
      const nailed = questions.filter((q) => (attempts[q.id]?.hits ?? 0) > 0 && !attempts[q.id]?.burned).length;
      const strength = questions.length
        ? questions.reduce((s, q) => s + strengthOf(q.id, attempts, srs, now), 0) / questions.length
        : 0;
      const key = stageKey(ref.id, tier);
      raw.set(key, {
        questions,
        stage: {
          moduleId: ref.id,
          tier,
          key,
          total: questions.length,
          nailed,
          strength,
          status: 'locked',
          earnedEarly: progress.unlockedEarly.includes(key),
        },
      });
    }
  }

  const isCleared = (key: string): boolean => {
    if (progress.stagesCleared[key]) return true;
    const entry = raw.get(key);
    if (!entry || entry.stage.total === 0) return false;
    return entry.stage.nailed / entry.stage.total >= CLEAR_THRESHOLD;
  };

  /** A module counts as "entered" once its lowest tier that actually has questions is cleared. */
  const entryCleared = (moduleId: string): boolean => {
    const tier = TIERS.find((t) => (raw.get(stageKey(moduleId, t))?.stage.total ?? 0) > 0);
    return tier ? isCleared(stageKey(moduleId, tier)) : true;
  };

  /** Every tier that has questions is cleared. This is what opens the next module. */
  const fullyCleared = (moduleId: string): boolean =>
    TIERS.filter((t) => (raw.get(stageKey(moduleId, t))?.stage.total ?? 0) > 0).every((t) =>
      isCleared(stageKey(moduleId, t)),
    );

  const allCoreEntered = core.every((m) => entryCleared(m.id));

  // Second pass: resolve lock state now that every stage's clear status is known.
  const out: ModuleState[] = [];
  for (const ref of modules) {
    const stages: Stage[] = [];
    for (let i = 0; i < TIERS.length; i++) {
      const tier = TIERS[i];
      const key = stageKey(ref.id, tier);
      const stage = raw.get(key)!.stage;

      // Look back past any tier that has no questions yet: an unwritten tier gates nothing.
      let prev = i - 1;
      while (prev >= 0 && (raw.get(stageKey(ref.id, TIERS[prev]))?.stage.total ?? 0) === 0) prev--;

      let open: boolean;
      if (prev >= 0) {
        open = isCleared(stageKey(ref.id, TIERS[prev]));
      } else if (ref.track === 'fit') {
        open = true;
      } else if (ref.track === 'sector') {
        open = allCoreEntered;
      } else {
        const idx = core.findIndex((m) => m.id === ref.id);
        open = idx <= 0 || fullyCleared(core[idx - 1].id);
      }

      stage.status = isCleared(key) ? 'cleared' : open || stage.earnedEarly ? 'open' : 'locked';
      stages.push(stage);
    }

    const total = stages.reduce((s, st) => s + st.total, 0);
    const strength = total
      ? stages.reduce((s, st) => s + st.strength * st.total, 0) / total
      : 0;
    out.push({
      ref,
      stages,
      total,
      strength,
      status: stages.every((s) => s.status === 'cleared')
        ? 'cleared'
        : stages.some((s) => s.status !== 'locked')
          ? 'open'
          : 'locked',
      ready: total > 0,
    });
  }
  return out;
}

/** Headline number: how much of the built material you could actually deliver right now. */
export function readiness(modules: ModuleState[]): number {
  const built = modules.filter((m) => m.ready && m.ref.track !== 'sector');
  const total = built.reduce((s, m) => s + m.total, 0);
  if (!total) return 0;
  return Math.round((built.reduce((s, m) => s + m.strength * m.total, 0) / total) * 100);
}

/** The stage to point the user at: the first open, uncleared stage in ladder order. */
export function nextStage(modules: ModuleState[]): Stage | undefined {
  for (const m of modules) {
    if (!m.ready) continue;
    for (const tier of TIERS) {
      const st = m.stages.find((s) => s.tier === tier);
      if (st && st.status === 'open' && st.total > 0) return st;
    }
  }
  return undefined;
}

/**
 * The Danger Zone: questions you were confident about and then got wrong.
 * Anything on this list would have gone badly in a real interview, which makes it the
 * highest-value thing you can restudy.
 */
export function dangerZone(
  banks: Record<string, QuestionBank>,
  attempts: AttemptMap,
): { question: Question; moduleId: string }[] {
  const out: { question: Question; moduleId: string }[] = [];
  for (const [moduleId, bank] of Object.entries(banks)) {
    for (const q of bank.questions) {
      if (attempts[q.id]?.burned) out.push({ question: q, moduleId });
    }
  }
  return out.sort((a, b) => (attempts[b.question.id]?.last ?? 0) - (attempts[a.question.id]?.last ?? 0));
}

/** Everything due for spaced review right now, hardest-first so you hit the weak stuff awake. */
export function dueQuestions(
  banks: Record<string, QuestionBank>,
  attempts: AttemptMap,
  srs: SrsMap,
  now = Date.now(),
): Question[] {
  const seen: Question[] = [];
  for (const bank of Object.values(banks)) {
    for (const q of bank.questions) {
      const a = attempts[q.id];
      if (!a || a.hits + a.misses === 0) continue; // never attempted = new, not "due"
      if (isDue(srs[q.id], now)) seen.push(q);
    }
  }
  const rank: Record<Tier, number> = { hard: 0, medium: 1, easy: 2 };
  return seen.sort((a, b) => rank[a.tier] - rank[b.tier]);
}

// ---- Headline figures for the home screen ----

export interface TierProgress {
  tier: Tier;
  cleared: number;
  total: number;
  nailed: number;
  questions: number;
}

/** Stage completion per tier across the whole curriculum. Answers "how far up am I". */
export function tierProgress(modules: ModuleState[]): TierProgress[] {
  return TIERS.map((tier) => {
    const stages = modules
      .filter((m) => m.ready && m.ref.track !== 'sector')
      .map((m) => m.stages.find((s) => s.tier === tier))
      .filter((s): s is Stage => !!s && s.total > 0);
    return {
      tier,
      cleared: stages.filter((s) => s.status === 'cleared').length,
      total: stages.length,
      nailed: stages.reduce((n, s) => n + s.nailed, 0),
      questions: stages.reduce((n, s) => n + s.total, 0),
    };
  });
}

/** Questions nailed against questions written, across everything built. */
export function coverage(modules: ModuleState[]): { nailed: number; total: number } {
  const built = modules.filter((m) => m.ready);
  return {
    nailed: built.reduce((n, m) => n + m.stages.reduce((s, st) => s + st.nailed, 0), 0),
    total: built.reduce((n, m) => n + m.total, 0),
  };
}

/** Modules you would least like to be asked about, weakest first, ignoring untouched locked ones. */
export function weakestFirst(modules: ModuleState[]): ModuleState[] {
  return modules
    .filter((m) => m.ready && m.stages.some((s) => s.status !== 'locked'))
    .sort((a, b) => a.strength - b.strength);
}
