import { useEffect, useMemo, useState } from 'preact/hooks';
import { loadIndex, loadDeck } from '../lib/content';
import { navigate } from '../lib/router';
import { getSrsMap, setSrsState, getSettings, recordStudy, type SrsMap } from '../lib/db';
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
          <li key={s.id} onClick={() => navigate(`browse/${s.id}`)}>
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

// ---- Browse: a responsive, overviewable grid of every card in a deck ----
type Status = 'new' | 'due' | 'learned';
function statusOf(srs: SrsMap, id: string): Status {
  const s = srs[id];
  if (!s) return 'new';
  return isDue(s) ? 'due' : 'learned';
}
const STATUS_FILTERS: { key: Status | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'due', label: 'Due' },
  { key: 'new', label: 'New' },
  { key: 'learned', label: 'Learned' },
];

export function Browse({ deckId }: { deckId: string }) {
  const [deck, setDeck] = useState<FlashcardDeck | null>(null);
  const [title, setTitle] = useState('');
  const [srs, setSrs] = useState<SrsMap>({});
  const [error, setError] = useState(false);
  const [q, setQ] = useState('');
  const [tag, setTag] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | 'all'>('all');
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [revealAll, setRevealAll] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const index = await loadIndex();
        const ref = index.flashcardDecks.find((d) => d.id === deckId);
        if (!ref) throw new Error('nf');
        const [d, map] = await Promise.all([loadDeck(ref.path), getSrsMap()]);
        if (!alive) return;
        setDeck(d);
        setTitle(ref.title);
        setSrs(map);
      } catch {
        if (alive) setError(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [deckId]);

  const tags = useMemo(() => {
    if (!deck) return [];
    const set = new Set<string>();
    deck.cards.forEach((c) => c.tags?.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [deck]);

  const counts = useMemo(() => {
    const c = { all: 0, new: 0, due: 0, learned: 0 };
    deck?.cards.forEach((card) => {
      c.all++;
      c[statusOf(srs, card.id)]++;
    });
    return c;
  }, [deck, srs]);

  const filtered = useMemo(() => {
    if (!deck) return [];
    const s = q.trim().toLowerCase();
    return deck.cards.filter((c) => {
      if (tag && !c.tags?.includes(tag)) return false;
      if (status !== 'all' && statusOf(srs, c.id) !== status) return false;
      if (s && !(c.front.toLowerCase().includes(s) || c.back.toLowerCase().includes(s))) return false;
      return true;
    });
  }, [deck, q, tag, status, srs]);

  if (error) return <Empty title="Browse" note="Couldn't load this deck." back="cards" />;
  if (!deck) return <Loading />;

  const showBack = (id: string) => revealAll !== !!flipped[id]; // XOR: reveal-all inverts per-card flip

  return (
    <section>
      <BackLink to="cards" label="Flashcards" />
      <h1>{title}</h1>
      <div class="browse-toolbar">
        <button class="btn btn-primary" disabled={counts.due === 0} onClick={() => navigate(`review/${deckId}`)}>
          {counts.due > 0 ? `Review ${counts.due} due` : 'No cards due'}
        </button>
        <button class="btn btn-ghost" onClick={() => setRevealAll((v) => !v)}>
          {revealAll ? 'Hide answers' : 'Show answers'}
        </button>
      </div>

      <input
        class="search"
        placeholder={`Search ${deck.cards.length} cards…`}
        value={q}
        onInput={(e) => setQ((e.target as HTMLInputElement).value)}
      />

      <div class="chips">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            class={'chip' + (status === f.key ? ' on' : '')}
            onClick={() => setStatus(f.key)}
          >
            {f.label} <span class="chip-n">{counts[f.key]}</span>
          </button>
        ))}
      </div>
      {tags.length > 0 && (
        <div class="chips">
          <button class={'chip' + (tag === null ? ' on' : '')} onClick={() => setTag(null)}>
            All tags
          </button>
          {tags.map((t) => (
            <button key={t} class={'chip' + (tag === t ? ' on' : '')} onClick={() => setTag(tag === t ? null : t)}>
              {t}
            </button>
          ))}
        </div>
      )}

      <div class="browse-grid">
        {filtered.map((c) => {
          const st = statusOf(srs, c.id);
          const back = showBack(c.id);
          return (
            <button
              key={c.id}
              class={'browse-card' + (back ? ' show-back' : '')}
              onClick={() => setFlipped((f) => ({ ...f, [c.id]: !f[c.id] }))}
            >
              <span class={'dot ' + st} title={st} />
              <div class="bc-text">{back ? c.back : c.front}</div>
              <div class="bc-foot">
                {c.tags?.map((t) => (
                  <span key={t} class="tag">
                    {t}
                  </span>
                ))}
                {c.difficulty && <span class={'diff ' + c.difficulty}>{c.difficulty}</span>}
              </div>
            </button>
          );
        })}
      </div>
      {filtered.length === 0 && <p class="muted">No cards match.</p>}
    </section>
  );
}
