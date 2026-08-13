// Review: an Anki-style scheduler behind a card interface that reads like Quizlet.
//
// The queue mixes learning cards that have come due, review cards due today, and a capped
// number of new ones. Grading uses the four SM-2 buttons, each labelled with the delay it will
// actually apply, so the scheduling is visible rather than hidden.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { navigate } from '../lib/router';
import { renderMarkdown } from '../lib/md';
import {
  getSettings,
  getSrsMap,
  recordAttempt,
  recordStudy,
  setSrsState,
  type SrsMap,
} from '../lib/db';
import { isDue, isNew, phaseOf, previewIntervals, review as srsReview, type Grade } from '../lib/srs';
import { TIER_LABEL, type Question } from '../lib/schema';
import { dangerZone } from '../lib/curriculum';
import { useLadder } from '../lib/useLadder';
import { Loading, LoadError, Ring } from './ui';

type Mode = 'due' | 'danger';

interface Card {
  q: Question;
  moduleShort: string;
  moduleIcon: string;
}

const GRADES: { g: Grade; label: string; cls: string; key: string }[] = [
  { g: 'again', label: 'Again', cls: 'again', key: '1' },
  { g: 'hard', label: 'Hard', cls: 'hard', key: '2' },
  { g: 'good', label: 'Good', cls: 'good', key: '3' },
  { g: 'easy', label: 'Easy', cls: 'easy', key: '4' },
];

export function Review({ mode = 'due' }: { mode?: Mode }) {
  const { data, error } = useLadder();
  const [srs, setSrs] = useState<SrsMap>({});
  const [queue, setQueue] = useState<Card[] | null>(null);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [counts, setCounts] = useState({ done: 0, again: 0 });
  const [newLimit, setNewLimit] = useState(20);
  const started = useRef(Date.now());

  useEffect(() => {
    (async () => {
      const [map, settings] = await Promise.all([getSrsMap(), getSettings()]);
      setSrs(map);
      setNewLimit(settings.dailyNewLimit);
    })();
  }, []);

  // Build the session once the content and scheduling state are both available.
  useEffect(() => {
    if (!data || queue) return;
    const byModule: Record<string, { short: string; icon: string }> = {};
    for (const m of data.modules) byModule[m.ref.id] = { short: m.ref.short, icon: m.ref.icon };

    if (mode === 'danger') {
      const cards = dangerZone(data.banks, data.attempts).map(({ question, moduleId }) => ({
        q: question,
        moduleShort: byModule[moduleId]?.short ?? '',
        moduleIcon: byModule[moduleId]?.icon ?? '',
      }));
      setQueue(cards);
      return;
    }

    const learning: Card[] = [];
    const due: Card[] = [];
    const fresh: Card[] = [];
    for (const [moduleId, bank] of Object.entries(data.banks)) {
      const meta = byModule[moduleId] ?? { short: '', icon: '' };
      for (const q of bank.questions) {
        const state = srs[q.id];
        const card = { q, moduleShort: meta.short, moduleIcon: meta.icon };
        if (isNew(state)) {
          // only questions you have already met in a drill enter the new queue
          if ((data.attempts[q.id]?.hits ?? 0) + (data.attempts[q.id]?.misses ?? 0) > 0) fresh.push(card);
        } else if (isDue(state)) {
          (phaseOf(state) === 'learning' ? learning : due).push(card);
        }
      }
    }
    setQueue([...learning, ...due, ...fresh.slice(0, newLimit)]);
  }, [data, srs, newLimit, mode, queue]);

  const card = queue && pos < queue.length ? queue[pos] : null;
  const previews = useMemo(
    () => (card ? previewIntervals(srs[card.q.id]) : null),
    [card, srs],
  );

  async function grade(g: Grade) {
    if (!card) return;
    const next = srsReview(srs[card.q.id], g);
    await setSrsState(card.q.id, next);
    await recordAttempt(card.q.id, g !== 'again', false);
    await recordStudy(g === 'again' ? 1 : 3);
    setSrs((m) => ({ ...m, [card.q.id]: next }));
    setCounts((c) => ({ done: c.done + 1, again: c.again + (g === 'again' ? 1 : 0) }));
    setFlipped(false);
    // A lapsed card comes back at the end of this session, the way Anki puts it back in the queue.
    if (g === 'again') setQueue((qq) => (qq ? [...qq, card] : qq));
    setPos((p) => p + 1);
  }

  // Space flips, 1 to 4 grade, the way a keyboard user expects.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!card) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setFlipped((f) => !f);
        return;
      }
      if (!flipped) return;
      const hit = GRADES.find((x) => x.key === e.key);
      if (hit) {
        e.preventDefault();
        grade(hit.g);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (error) return <LoadError title="Review" />;
  if (!data || !queue) return <Loading />;

  if (queue.length === 0) {
    return (
      <section>
        <h1>{mode === 'danger' ? 'Danger zone' : 'Review'}</h1>
        <div class="empty-state">
          <div class="empty-icon">{mode === 'danger' ? '🛡️' : '✅'}</div>
          <p>
            {mode === 'danger'
              ? 'Nothing burned. Questions land here when you say you know one and then miss it.'
              : 'Nothing due. Cards enter review once you have met them in a drill, and come back on a schedule.'}
          </p>
          <button class="btn btn-primary" onClick={() => navigate('climb')}>
            Go to the climb
          </button>
        </div>
      </section>
    );
  }

  if (!card) {
    const mins = Math.max(1, Math.round((Date.now() - started.current) / 60000));
    const accuracy = counts.done ? Math.round(((counts.done - counts.again) / counts.done) * 100) : 0;
    return (
      <section>
        <h1>Session complete</h1>
        <div class="result-card">
          <Ring pct={accuracy} label="recalled" />
          <div class="result-msg">
            {counts.done} card{counts.done === 1 ? '' : 's'} in {mins} min
          </div>
          <div class="muted">{counts.again} to come back sooner</div>
        </div>
        <button class="btn btn-primary" onClick={() => navigate('home')}>
          Done
        </button>
      </section>
    );
  }

  const remaining = queue.length - pos;
  const state = srs[card.q.id];
  const phase = phaseOf(state);

  return (
    <section class="review-wrap">
      <div class="review-top">
        <button class="backlink" onClick={() => navigate('home')}>
          ‹ Home
        </button>
        <div class="review-counts">
          <span class={'qpill ' + phase}>{phase}</span>
          <span class="muted small">
            {remaining} left · {counts.done} done
          </span>
        </div>
      </div>
      <div class="bar thin">
        <div
          class="bar-fill"
          style={{ width: ((counts.done / (counts.done + remaining)) * 100 || 0) + '%' }}
        />
      </div>

      <div
        class={'flashcard-3d' + (flipped ? ' flipped' : '')}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
      >
        <div class="fc-inner">
          <div class="fc-face fc-front">
            <div class="fc-meta">
              <span>
                {card.moduleIcon} {card.moduleShort}
              </span>
              <span class={'tier-badge ' + card.q.tier}>{TIER_LABEL[card.q.tier]}</span>
            </div>
            <div class="fc-prompt">{card.q.prompt}</div>
            <div class="fc-hint muted small">Tap or press space to flip</div>
          </div>
          <div class="fc-face fc-back">
            <div class="fc-meta">
              <span class="muted small">Answer</span>
            </div>
            <div
              class="fc-answer prose"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(card.q.answer) }}
            />
            {card.q.keyPoints && card.q.keyPoints.length > 0 && (
              <ul class="fc-points">
                {card.q.keyPoints.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {flipped ? (
        <div class="grade-row">
          {GRADES.map((x) => (
            <button key={x.g} class={'grade ' + x.cls} onClick={() => grade(x.g)}>
              <span class="grade-label">{x.label}</span>
              <span class="grade-when">{previews?.[x.g]}</span>
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

export function DangerReview() {
  return <Review mode="danger" />;
}
