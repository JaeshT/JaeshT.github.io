import { useEffect, useState } from 'preact/hooks';
import { loadIndex, loadDeck } from '../lib/content';
import { navigate } from '../lib/router';
import { getSrsMap, setSrsState, getSettings, recordStudy } from '../lib/db';
import { review, isDue, type Grade } from '../lib/srs';
import type { Flashcard, FlashcardDeck } from '../lib/schema';
import { Loading, Empty, BackLink } from './learn';

interface DeckStat {
  id: string;
  title: string;
  total: number;
  due: number;
}

export function Cards() {
  const [stats, setStats] = useState<DeckStat[] | null>(null);
  const [totalDue, setTotalDue] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const index = await loadIndex();
        const srs = await getSrsMap();
        const decks = await Promise.all(index.flashcardDecks.map((d) => loadDeck(d.path)));
        const s: DeckStat[] = decks.map((deck, n) => {
          const due = deck.cards.filter((c) => isDue(srs[c.id])).length;
          return { id: deck.id, title: index.flashcardDecks[n].title, total: deck.cards.length, due };
        });
        if (!alive) return;
        setStats(s);
        setTotalDue(s.reduce((a, b) => a + b.due, 0));
      } catch {
        if (alive) setError(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (error) return <Empty title="Flashcards" note="Couldn't load decks. Add content and rebuild." />;
  if (!stats) return <Loading />;
  if (stats.length === 0)
    return <Empty title="Flashcards" note="No decks yet — they arrive as each domain is built." />;

  return (
    <section>
      <h1>Flashcards</h1>
      <button class="btn btn-primary big" disabled={totalDue === 0} onClick={() => navigate('review')}>
        {totalDue > 0 ? `Review ${totalDue} due card${totalDue === 1 ? '' : 's'}` : 'All caught up 🎉'}
      </button>
      <ul class="list">
        {stats.map((s) => (
          <li key={s.id} onClick={() => navigate(`review/${s.id}`)}>
            <span>🃏 {s.title}</span>
            <span class="row-meta">
              {s.due > 0 ? <span class="pill warn">{s.due} due</span> : <span class="pill ok">✓</span>}
              <span class="muted small">{s.total}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const GRADES: { g: Grade; label: string; cls: string }[] = [
  { g: 'again', label: 'Again', cls: 'again' },
  { g: 'hard', label: 'Hard', cls: 'hard' },
  { g: 'good', label: 'Good', cls: 'good' },
  { g: 'easy', label: 'Easy', cls: 'easy' },
];

export function Review({ deckId }: { deckId?: string }) {
  const [queue, setQueue] = useState<Flashcard[] | null>(null);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const index = await loadIndex();
        const refs = deckId
          ? index.flashcardDecks.filter((d) => d.id === deckId)
          : index.flashcardDecks;
        const decks: FlashcardDeck[] = await Promise.all(refs.map((d) => loadDeck(d.path)));
        const srs = await getSrsMap();
        const settings = await getSettings();
        const cards = decks.flatMap((d) => d.cards);
        const reviews = cards.filter((c) => srs[c.id] && isDue(srs[c.id]));
        const fresh = cards.filter((c) => !srs[c.id]).slice(0, settings.dailyNewCardLimit);
        const q = [...reviews, ...fresh];
        if (alive) setQueue(q);
      } catch {
        if (alive) setError(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [deckId]);

  if (error) return <Empty title="Review" note="Couldn't start review." back="cards" />;
  if (!queue) return <Loading />;

  if (queue.length === 0 || pos >= queue.length) {
    return (
      <section>
        <BackLink to="cards" label="Flashcards" />
        <div class="result-card">
          <div class="result-score">{reviewed}</div>
          <div class="muted">cards reviewed</div>
        </div>
        <button class="btn btn-primary" onClick={() => navigate('cards')}>
          Done
        </button>
      </section>
    );
  }

  const card = queue[pos];

  async function grade(g: Grade) {
    const srs = await getSrsMap();
    const next = review(srs[card.id], g);
    await setSrsState(card.id, next);
    await recordStudy(g === 'again' ? 1 : 3);
    setReviewed((r) => r + 1);
    // A lapsed card comes back later in the same session.
    if (g === 'again') setQueue((q) => (q ? [...q, card] : q));
    setFlipped(false);
    setPos((p) => p + 1);
  }

  return (
    <section>
      <BackLink to="cards" label="Flashcards" />
      <div class="quiz-progress">
        {pos + 1} of {queue.length}
      </div>
      <div class={'flashcard' + (flipped ? ' flipped' : '')} onClick={() => setFlipped(true)}>
        <div class="fc-label">{flipped ? 'Answer' : 'Question'}</div>
        <div class="fc-body">{flipped ? card.back : card.front}</div>
        {!flipped && <div class="fc-hint muted small">tap to flip</div>}
      </div>
      {flipped ? (
        <div class="grade-row">
          {GRADES.map((x) => (
            <button key={x.g} class={'grade ' + x.cls} onClick={() => grade(x.g)}>
              {x.label}
            </button>
          ))}
        </div>
      ) : (
        <button class="btn btn-primary big" onClick={() => setFlipped(true)}>
          Show answer
        </button>
      )}
    </section>
  );
}
