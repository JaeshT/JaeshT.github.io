import type { Exercise, Module, Tier } from '../lib/schema';
import { ACCOUNTING } from './accounting';
import { ACCOUNTING_EXTRA } from './accounting-extra';
import { EV_EQV_CORE } from './ev-eqv-core';
import { EV_EQV_HARD } from './ev-eqv-hard';
import { VALUATION } from './valuation';
import { DCF } from './dcf';
import { MA } from './ma';

// Registered up front so authors only ever touch their own file.
export const EXERCISES: Exercise[] = [
  ...ACCOUNTING,
  ...ACCOUNTING_EXTRA,
  ...EV_EQV_CORE,
  ...EV_EQV_HARD,
  ...VALUATION,
  ...DCF,
  ...MA,
];

export function byId(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}

export function byModule(module: Module): Exercise[] {
  return EXERCISES.filter((e) => e.module === module);
}

const TIER_ORDER: Record<Tier, number> = { easy: 0, medium: 1, hard: 2 };
export function sorted(list: Exercise[]): Exercise[] {
  return [...list].sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier]);
}
