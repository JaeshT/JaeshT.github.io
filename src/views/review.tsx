// Review: FSRS scheduling behind a card interface that reads like Quizlet.
//
// The queue mixes cards that have come due with a capped number you have met in a drill but never
// reviewed. Grading uses the same four buttons as the drill, each labelled with the delay it will
// actually apply, so the schedule is visible rather than hidden.

import { useEffect, useRef, useState } from 'preact/hooks';
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
import { isDue, isNew, phaseOf, review as srsReview, type Grade } from '../lib/srs';
import { TIER_LABEL, type Question } from '../lib/schema';
import { dangerZone } from '../lib/curriculum';
import { useLadder } from '../lib/useLadder';
import { GradeButtons, Loading, LoadError, Ring } from './ui';

type Mode = 'due' | 'danger';

interface Card {
  q: Question;
  moduleShort: string;
  moduleIcon: string;
}

export function Review({ mode = 'due' }: { mode?: Mode }) {
  const { data, error } = useLadder();
  const [srs, setSrs] = useState<SrsMap>({});
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [counts, setCounts] = useState({ done: 0, again: 0 });
  const [newLimit, setNewLimit] = useState(20);
  const [showInfo, setShowInfo] = useState(false);
  const [ready, setReady] = useState(false);
  const started = useRef(Date.now());
  const grading = useRef(false);

  // The queue is built once from a snapshot of state and then frozen for the session. Rebuilding
  // it as scheduling changes would reorder the cards under the current index mid-session.
  const frozen = useRef<Card[] | null>(null);

  useEffect(() => {
    (async () => {
      const [map, settings] = await Promise.all([getSrsMap(), getSettings()]);
      setSrs(map);
      setNewLimit(settings.dailyNewLimit);
      setReady(true);
    })();
  }, []);

  if (!frozen.current && data && ready) {
    const byModule: Record<string, { short: string; icon: string }> = {};
    for (const m of data.modules) byModule[m.ref.id] = { short: m.ref.short, icon: m.ref.icon };
    const meta = (id: string) => byModule[id] ?? { short: '', icon: '' };

    if (mode === 'danger') {
      frozen.current = dangerZone(data.banks, data.attempts).map(({ question, moduleId }) => ({
        q: question,
        moduleShort: meta(moduleId).short,
        moduleIcon: meta(moduleId).icon,
      }));
    } else {
      const due: Card[] = [];
      const fresh: Card[] = [];
      for (const [moduleId, bank] of Object.entries(data.banks)) {
        const m = meta(moduleId);
        for (const q of bank.questions) {
          const state = srs[q.id];
          const card = { q, moduleShort: m.short, moduleIcon: m.icon };
          const met = (data.attempts[q.id]?.hits ?? 0) + (data.attempts[q.id]?.misses ?? 0) > 0;
          if (!met) continue; // never drilled: it belongs to the climb, not to review
          if (isNew(state)) fresh.push(card);
          else if (isDue(state)) due.push(card);
        }
      }
      frozen.current = [...due, ...fresh.slice(0, newLimit)];
    }
  }
  const queue = frozen.current;

  const card = queue && pos < queue.length ? queue[pos] : null;

  async function grade(g: Grade) {
    if (!card || grading.current) return;
    grading.current = true;
    try {
      const next = srsReview(srs[card.q.id], g);
      await setSrsState(card.q.id, next);
      await recordAttempt(card.q.id, g !== 'again');
      await recordStudy(g === 'again' ? 1 : 3);
      setSrs((m) => ({ ...m, [card.q.id]: next }));
      setCounts((c) => ({ done: c.done + 1, again: c.again + (g === 'again' ? 1 : 0) }));
      setFlipped(false);
      // A lapse comes back at the end of this session, the way Anki re-queues it.
      if (g === 'again') frozen.current = [...(frozen.current ?? []), card];
      setPos((p) => p + 1);
    } finally {
      grading.current = false;
    }
  }

  // Space flips. Number keys grade, but only once the answer is showing. Keys are ignored while
  // focus is in a control, so a button press never both activates the button and flips the card.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!card) return;
      const el = e.target as HTMLElement | null;
      if (el && /^(BUTTON|INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setFlipped((f) => !f);
        return;
      }
      if (!flipped) return;
      const idx = ['1', '2', '3', '4'].indexOf(e.key);
      if (idx >= 0) {
        e.preventDefault();
        grade((['again', 'hard', 'good', 'easy'] as Grade[])[idx]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [card, flipped]);

  if (error) return <LoadError title="Review" />;
  if (!data || !queue) return <Loading />;

  const heading = mode === 'danger' ? 'Danger zone' : 'Review';

  if (queue.length === 0) {
    return (
      <section>
        <div class="review-head">
          <h1>{heading}</h1>
          <InfoButton on={showInfo} toggle={() => setShowInfo((v) => !v)} />
        </div>
        {showInfo && <QueueInfo mode={mode} limit={newLimit} />}
        <div class="empty-state">
          <div class="empty-icon">{mode === 'danger' ? '🛡️' : '✅'}</div>
          <p>
            {mode === 'danger'
              ? 'Nothing burned. Questions land here when you had one right before and then lose it.'
              : 'Nothing due. Cards arrive here after you have met them in a drill, and come back on a schedule.'}
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
  const phase = phaseOf(srs[card.q.id]);

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
          <InfoButton on={showInfo} toggle={() => setShowInfo((v) => !v)} />
        </div>
      </div>
      {showInfo && <QueueInfo mode={mode} limit={newLimit} />}
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
        <GradeButtons key={card.q.id} srs={srs} id={card.q.id} onGrade={grade} />
      ) : (
        <button class="btn btn-primary big" onClick={() => setFlipped(true)}>
          Show answer
        </button>
      )}
    </section>
  );
}

function InfoButton({ on, toggle }: { on: boolean; toggle: () => void }) {
  return (
    <button
      class="info-btn"
      aria-label="What is in this queue"
      aria-expanded={on}
      title="What is in this queue"
      onClick={toggle}
    >
      i
    </button>
  );
}

/** Says plainly which cards are here, because "review" on its own does not tell you. */
function QueueInfo({ mode, limit }: { mode: Mode; limit: number }) {
  if (mode === 'danger') {
    return (
      <div class="explainer">
        <h2>What is in the danger zone</h2>
        <ul>
          <li>
            Questions you <em>had right before</em>, and then graded Again.
          </li>
          <li>
            Something you have lost is worth fixing ahead of something you never learned: it is the
            gap you do not know you have.
          </li>
          <li>A question leaves once you nail it again.</li>
        </ul>
      </div>
    );
  }
  return (
    <div class="explainer">
      <h2>What is in this queue</h2>
      <ul>
        <li>
          <strong>Every question you have drilled.</strong> Grading one correctly puts it here too,
          simply with a longer gap before it comes back.
        </li>
        <li>
          A card appears here when it falls <strong>due</strong>. Missing one brings it back in
          minutes; getting it right pushes it days or weeks out.
        </li>
        <li>
          Questions you have never drilled are not here. They live on the climb, and join review
          once you have met them, up to {limit} new ones per session.
        </li>
        <li>
          Grading tells the scheduler how hard it felt, and each button shows the delay it will
          apply before you press it.
        </li>
      </ul>
    </div>
  );
}

export function DangerReview() {
  return <Review mode="danger" />;
}
