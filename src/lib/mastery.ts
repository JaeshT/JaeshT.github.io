// Derived progress signals for the dashboard: per-domain mastery + achievements.
// Pure functions over the content index + SRS map + progress (no I/O).

import type { ContentIndex, Domain, FlashcardDeck } from './schema';
import type { SrsMap, Progress } from './db';

export interface DomainMastery {
  domain: Domain;
  pct: number; // 0..100
  lessonsDone: number;
  lessonsTotal: number;
  cardsLearned: number;
  cardsTotal: number;
  quizBest?: number; // 0..1
}

/** A card counts as "learned" once it has graduated past the early relearning steps. */
export function isLearned(srs: SrsMap, id: string): boolean {
  const s = srs[id];
  return !!s && s.reps >= 2;
}

export function computeMastery(
  index: ContentIndex,
  decksById: Record<string, FlashcardDeck>,
  srs: SrsMap,
  progress: Progress,
): DomainMastery[] {
  const domains = new Set<Domain>();
  index.lessons.forEach((l) => domains.add(l.domain));
  index.flashcardDecks.forEach((d) => domains.add(d.domain));
  index.quizzes.forEach((q) => domains.add(q.domain));

  const out: DomainMastery[] = [];
  for (const domain of domains) {
    const lessons = index.lessons.filter((l) => l.domain === domain);
    const lessonsDone = lessons.filter((l) => progress.lessonsRead.includes(l.id)).length;

    const decks = index.flashcardDecks.filter((d) => d.domain === domain);
    let cardsTotal = 0;
    let cardsLearned = 0;
    for (const ref of decks) {
      const deck = decksById[ref.id];
      if (!deck) continue;
      cardsTotal += deck.cards.length;
      cardsLearned += deck.cards.filter((c) => isLearned(srs, c.id)).length;
    }

    const quizIds = new Set(index.quizzes.filter((q) => q.domain === domain).map((q) => q.id));
    let quizBest: number | undefined;
    for (const a of progress.quizAttempts) {
      if (quizIds.has(a.quizId) && a.total > 0) {
        quizBest = Math.max(quizBest ?? 0, a.score / a.total);
      }
    }

    // Weighted blend over the components that exist for this domain.
    const parts: { w: number; v: number }[] = [];
    if (lessons.length) parts.push({ w: 0.35, v: lessonsDone / lessons.length });
    if (cardsTotal) parts.push({ w: 0.45, v: cardsLearned / cardsTotal });
    if (quizBest !== undefined) parts.push({ w: 0.2, v: quizBest });
    const wsum = parts.reduce((s, p) => s + p.w, 0) || 1;
    const pct = Math.round((parts.reduce((s, p) => s + p.w * p.v, 0) / wsum) * 100);

    out.push({ domain, pct, lessonsDone, lessonsTotal: lessons.length, cardsLearned, cardsTotal, quizBest });
  }
  return out;
}

export interface Achievement {
  id: string;
  icon: string;
  label: string;
  desc: string;
  earned: boolean;
}

export function computeAchievements(
  progress: Progress,
  learnedCount: number,
  masteries: DomainMastery[],
): Achievement[] {
  const perfectQuiz = progress.quizAttempts.some((a) => a.total > 0 && a.score === a.total);
  const domainsTouched = masteries.filter((m) => m.pct > 0).length;
  const domainsMastered = masteries.filter((m) => m.pct >= 90).length;
  const def = (id: string, icon: string, label: string, desc: string, earned: boolean): Achievement => ({
    id, icon, label, desc, earned,
  });
  return [
    def('first-lesson', '📖', 'First Steps', 'Complete a lesson', progress.lessonsRead.length >= 1),
    def('streak-3', '🔥', 'On a Roll', '3-day streak', progress.streak.count >= 3),
    def('streak-7', '⚡', 'Week Warrior', '7-day streak', progress.streak.count >= 7),
    def('cards-50', '🃏', 'Card Shark', 'Learn 50 cards', learnedCount >= 50),
    def('cards-150', '🧠', 'Memory Machine', 'Learn 150 cards', learnedCount >= 150),
    def('perfect-quiz', '💯', 'Flawless', 'Ace a quiz', perfectQuiz),
    def('explorer', '🧭', 'Explorer', 'Touch 4 domains', domainsTouched >= 4),
    def('master', '🏆', 'Domain Master', 'Master a domain', domainsMastered >= 1),
  ];
}
