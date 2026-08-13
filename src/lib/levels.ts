// Character progression. XP comes from drilling (4 per question nailed, 1 per miss, 10 per primer),
// and it converts into an IB rank. Pure functions so the view stays dumb.

export interface Rank {
  level: number;
  title: string;
  xp: number; // XP required to reach this rank
  colour: string; // character accent at this rank
}

/**
 * The ladder warms as you climb: stone at the bottom, brass at the top. Chosen to sit on both
 * the bone and the navy backgrounds, and to stay clear of the blue end entirely.
 */
export const RANKS: Rank[] = [
  { level: 1, title: 'Intern', xp: 0, colour: '#9a9382' },
  { level: 2, title: 'Analyst 1', xp: 150, colour: '#7f9a86' },
  { level: 3, title: 'Analyst 2', xp: 350, colour: '#6faa8c' },
  { level: 4, title: 'Analyst 3', xp: 600, colour: '#89a86a' },
  { level: 5, title: 'Associate', xp: 900, colour: '#c9a13f' },
  { level: 6, title: 'VP', xp: 1300, colour: '#d98b4a' },
  { level: 7, title: 'Director', xp: 1800, colour: '#c96a45' },
  { level: 8, title: 'Managing Director', xp: 2500, colour: '#d9a441' },
];

export interface Progression {
  rank: Rank;
  next?: Rank;
  intoRank: number; // XP earned inside the current rank
  needed: number; // XP span of the current rank
  pct: number; // 0..100 progress toward the next rank
}

export function progressionFor(xp: number): Progression {
  let i = 0;
  while (i + 1 < RANKS.length && xp >= RANKS[i + 1].xp) i++;
  const rank = RANKS[i];
  const next = RANKS[i + 1];
  if (!next) return { rank, intoRank: xp - rank.xp, needed: 0, pct: 100 };
  const needed = next.xp - rank.xp;
  const intoRank = xp - rank.xp;
  return { rank, next, intoRank, needed, pct: Math.min(100, Math.round((intoRank / needed) * 100)) };
}
