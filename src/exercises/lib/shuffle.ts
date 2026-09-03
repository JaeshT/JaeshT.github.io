// Deterministic shuffle, seeded by the exercise id.
//
// Why this exists: an author naturally writes items grouped by their answer — all the add-backs,
// then all the traps. In a tray with no inherent order, that leaks the key positionally, and a
// learner can score well by noticing the shape of the list rather than knowing the material. One
// author caught exactly this in their own content and hand-interleaved it; a shuffle makes the
// authored order irrelevant instead of relying on everyone remembering.
//
// Seeded rather than random so an exercise looks the same each time you open it. Re-reading a
// debrief and finding the items rearranged is disorienting, and the shuffle is a defence against
// the author, not against the learner.
//
// NOT applied to ternary boards: their rows follow a real reading order (revenue down to net
// income, then the cash flow statement, then the balance sheet) and scrambling that would cost more
// than it protects. Boards are covered by a gate check on runs of same-direction rows instead.

function seedFrom(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function stableShuffle<T>(items: T[], seedKey: string): T[] {
  const out = [...items];
  let seed = seedFrom(seedKey) || 1;
  for (let i = out.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff;
    const j = seed % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * The seed a view should shuffle by.
 *
 * Includes the variant, so a re-attempt at fresh figures also gets a fresh tray order. That matters
 * most for the two formats with no figures at all: reordering is the only thing a second attempt at
 * a bucketing exercise can change, and without this it would change nothing.
 */
export function seedOf(ex: { id: string; variant?: number }): string {
  return `${ex.id}#${ex.variant ?? 0}`;
}
