// The drill runner: the main study loop.
//
// Every question in every section runs the same two beats, so the climb, the path and review are
// one system rather than three:
//   1. FRONT  the prompt on its own, with a timer, because in a real interview the silence is part
//             of the question. You answer it out loud, then flip. Space, click or the button.
//   2. BACK   the say-it-out-loud model answer, the must-hit points as a checklist you tick off
//             against what you actually said, and the four-button grade.
//
// There used to be a commit step before the reveal ("Not sure" / "I know this") and a separate
// nailed-or-missed grade after it, which meant answering the same question twice, and only in some
// stages. One grade, always the same four buttons, always after the reveal.

import { useEffect, useRef, useState } from 'preact/hooks';
import { lastLadderView, navigate } from '../lib/router';
import { renderMarkdown } from '../lib/md';
import {
  getAttempts,
  getSettings,
  getSrsMap,
  recordAttempt,
  recordStudy,
  setSrsState,
  updateProgress,
  type SrsMap,
} from '../lib/db';
import { review as srsReview, type Grade } from '../lib/srs';
import { TIER_LABEL, type Question, type Tier } from '../lib/schema';
import { CLEAR_THRESHOLD, dangerZone, dueQuestions, stageKey } from '../lib/curriculum';
import { useLadder } from '../lib/useLadder';
import { BackLink, Empty, GradeButtons, Loading, LoadError, Ring } from './ui';

type Mode =
  | { kind: 'stage'; moduleId: string; tier: Tier }
  | { kind: 'review' }
  | { kind: 'danger' };

export function StageDrill({ moduleId, tier }: { moduleId: string; tier: Tier }) {
  return <Drill mode={{ kind: 'stage', moduleId, tier }} />;
}
export function ReviewDrill() {
  return <Drill mode={{ kind: 'review' }} />;
}
export function DangerDrill() {
  return <Drill mode={{ kind: 'danger' }} />;
}

function titleFor(mode: Mode, moduleTitle: string): string {
  if (mode.kind === 'stage') return `${moduleTitle} · ${TIER_LABEL[mode.tier]}`;
  if (mode.kind === 'review') return 'Spaced review';
  return 'Danger zone';
}

/**
 * Where "back" goes. The climb opens a drill directly, so sending you to the module page would
 * drop you somewhere you never opened, and its own back link leads to the path: a section you
 * were never in. From the path the module page IS where you came from, so it stays.
 */
function backFor(mode: Mode): string {
  if (mode.kind !== 'stage') return 'home';
  return lastLadderView() === 'climb' ? 'climb' : `module/${mode.moduleId}`;
}

function backLabelFor(mode: Mode, moduleTitle: string): string {
  if (mode.kind !== 'stage') return 'Home';
  return lastLadderView() === 'climb' ? 'Climb' : moduleTitle || 'Back';
}

function Drill({ mode }: { mode: Mode }) {
  const { data, error } = useLadder();
  const [pos, setPos] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [timerTarget, setTimerTarget] = useState(90);
  const grading = useRef(false);
  // The scheduling state the grade-button labels are computed from. The ladder snapshot is frozen
  // at load, so reading it directly meant a card met twice in one session showed the delays it
  // would have had before you graded it. Review has always kept a live copy; this matches it.
  const [srs, setSrs] = useState<SrsMap>({});
  useEffect(() => {
    getSrsMap().then(setSrs);
  }, []);

  useEffect(() => {
    getSettings().then((s) => setTimerTarget(s.timerSeconds));
  }, []);

  // The queue is built once and then frozen. It used to be a useMemo over `data`, which looks
  // equivalent but is not: any reload of the ladder (a cloud sync applying a snapshot, say) handed
  // back a fresh `data`, the memo recomputed, and since the ordering puts unseen questions first,
  // grading a card reordered the list underneath the current index and the card visibly jumped.
  const frozen = useRef<Question[] | null>(null);
  if (!frozen.current && data) {
    if (mode.kind === 'stage') {
      const bank = data.banks[mode.moduleId];
      const qs = bank ? bank.questions.filter((q) => q.tier === mode.tier) : [];
      const seen = (q: Question) => (data.attempts[q.id]?.hits ?? 0) > 0 && !data.attempts[q.id]?.burned;
      // Unseen questions first: you make progress before you revise.
      frozen.current = [...qs.filter((q) => !seen(q)), ...qs.filter(seen)];
    } else if (mode.kind === 'review') {
      frozen.current = dueQuestions(data.banks, data.attempts, data.srs);
    } else {
      frozen.current = dangerZone(data.banks, data.attempts).map((d) => d.question);
    }
  }
  const queue = frozen.current;

  if (error) return <LoadError title="Drill" back={backFor(mode)} />;
  if (!data || !queue) return <Loading />;

  const moduleTitle = mode.kind === 'stage' ? (data.modules.find((m) => m.ref.id === mode.moduleId)?.ref.short ?? '') : '';
  const title = titleFor(mode, moduleTitle);

  if (queue.length === 0) {
    const note =
      mode.kind === 'danger'
        ? 'Nothing burned. Questions land here when you had one right before and then lose it.'
        : mode.kind === 'review'
          ? 'Nothing due for review. Come back tomorrow, or start a new stage from the path.'
          : 'No questions written for this stage yet.';
    return <Empty title={title} note={note} back={backFor(mode)} />;
  }

  if (pos >= queue.length) {
    return (
      <Summary
        title={title}
        results={results}
        total={queue.length}
        mode={mode}
        onRetry={() => {
          setPos(0);
          setResults({});
        }}
      />
    );
  }

  const q = queue[pos];

  async function onGraded(grade: Grade) {
    // Guard against a second grade landing while the first is still writing: a double tap, or a
    // keypress arriving on a button that already has focus, used to advance two questions at once.
    if (grading.current) return;
    grading.current = true;
    try {
      const question = queue![pos];
      const hit = grade !== 'again';
      await recordAttempt(question.id, hit);
      const map = await getSrsMap();
      const next = srsReview(map[question.id], grade);
      await setSrsState(question.id, next);
      setSrs((m) => ({ ...m, [question.id]: next }));
      await recordStudy(hit ? 4 : 1);
      setResults((r) => ({ ...r, [question.id]: hit }));
      setPos((p) => p + 1);
    } finally {
      grading.current = false;
    }
  }

  return (
    <section>
      <BackLink to={backFor(mode)} label={backLabelFor(mode, moduleTitle)} />
      <div class="drill-head">
        <span class="muted small">{title}</span>
        <span class="muted small">
          {pos + 1} / {queue.length}
        </span>
      </div>
      <div class="bar thin">
        <div class="bar-fill" style={{ width: ((pos / queue.length) * 100).toFixed(1) + '%' }} />
      </div>
      <QuestionRunner key={q.id} q={q} timerTarget={timerTarget} srs={srs} onGraded={onGraded} />
    </section>
  );
}

// ---- one question ----

function QuestionRunner({
  q,
  timerTarget,
  srs,
  onGraded,
}: {
  q: Question;
  timerTarget: number;
  srs: SrsMap;
  onGraded: (grade: Grade) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [ticked, setTicked] = useState<Record<number, boolean>>({});
  const [deep, setDeep] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [val, setVal] = useState('');
  const [checkHit, setCheckHit] = useState<boolean | null>(null);
  const started = useRef(Date.now());

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - started.current) / 1000)), 500);
    return () => clearInterval(t);
  }, []);

  // Space flips, 1-4 grade once the answer is showing. Identical to review, deliberately: the two
  // screens are the same card system and muscle memory should carry between them. Keys are ignored
  // while focus sits in a control, so pressing a button never also flips the card.
  //
  // Subscribed exactly once per card, with the changing values read through refs. Listing `flipped`
  // and `onGraded` as dependencies instead re-subscribes on every render, and onGraded is a fresh
  // closure each time the drill re-renders: grading a card left two listeners attached for a beat,
  // so the next space toggled twice and appeared to do nothing.
  const flippedRef = useRef(false);
  const gradeRef = useRef(onGraded);
  gradeRef.current = onGraded;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && /^(BUTTON|INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        flippedRef.current = !flippedRef.current;
        setFlipped(flippedRef.current);
        return;
      }
      if (!flippedRef.current) return;
      const idx = ['1', '2', '3', '4'].indexOf(e.key);
      if (idx >= 0) {
        e.preventDefault();
        gradeRef.current((['again', 'hard', 'good', 'easy'] as Grade[])[idx]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /** Clicks and the button flip too, so the ref the keyboard reads has to move with them. */
  function flip(next: boolean) {
    flippedRef.current = next;
    setFlipped(next);
  }

  const points = q.keyPoints ?? [];
  const hitCount = points.filter((_, i) => ticked[i]).length;

  // Auto-gradeable questions resolve objectively first, then flip to the model answer and grade
  // on the same four buttons as everything else.
  if (q.check && !flipped) {
    return (
      <div class="qcard">
        <Timer elapsed={elapsed} target={timerTarget} />
        <p class="qprompt">{q.prompt}</p>
        {q.check.type === 'mcq' ? (
          <div class="choices">
            {q.check.choices.map((c, idx) => {
              const answered = checkHit !== null;
              const correctIdx = (q.check as { answerIndex: number }).answerIndex;
              let cls = 'choice';
              if (answered) {
                if (idx === correctIdx) cls += ' correct';
                else if (idx === picked) cls += ' wrong';
              } else if (idx === picked) cls += ' picked';
              return (
                <button
                  key={idx}
                  class={cls}
                  disabled={answered}
                  onClick={() => {
                    setPicked(idx);
                    setCheckHit(idx === correctIdx);
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        ) : (
          <div class="numrow">
            <input
              class="num-input"
              inputMode="decimal"
              placeholder="value"
              value={val}
              disabled={checkHit !== null}
              onInput={(e) => setVal((e.target as HTMLInputElement).value)}
            />
            {q.check.unit && <span class="unit">{q.check.unit}</span>}
            {checkHit === null && (
              <button
                class="btn btn-primary"
                disabled={val === ''}
                onClick={() => {
                  const check = q.check as { answer: number; tolerance?: number };
                  const num = parseFloat(val.replace(/[, $%]/g, ''));
                  const tol = check.tolerance ?? Math.abs(check.answer) * 0.01;
                  setCheckHit(!isNaN(num) && Math.abs(num - check.answer) <= tol);
                }}
              >
                Check
              </button>
            )}
          </div>
        )}
        {checkHit !== null && (
          <>
            <div class={'explain ' + (checkHit ? 'ok' : 'bad')}>
              {checkHit ? '✓ Correct.' : '✗ Not quite.'}{' '}
              {q.check.type === 'numeric' && !checkHit ? `Answer: ${q.check.answer}${q.check.unit ?? ''}. ` : ''}
              {q.check.explanation ?? ''}
            </div>
            <button class="btn btn-primary big" onClick={() => flip(true)}>
              Show answer
            </button>
          </>
        )}
      </div>
    );
  }

  if (!flipped) {
    return (
      <div class="qcard qcard-front" onClick={() => flip(true)} role="button" tabIndex={0}>
        <Timer elapsed={elapsed} target={timerTarget} />
        <p class="qprompt">{q.prompt}</p>
        <p class="muted small">Answer it out loud first.</p>
        <button
          class="btn btn-primary big"
          onClick={(e) => {
            e.stopPropagation();
            flip(true);
          }}
        >
          Show answer
        </button>
        <div class="fc-hint muted small">Tap or press space to flip</div>
      </div>
    );
  }

  return (
    <div class="qcard">
      <p class="qprompt">{q.prompt}</p>
      <div class="answer-label">Answer · you took {elapsed}s</div>
      <div class="model-answer prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(q.answer) }} />

      {points.length > 0 && (
        <div class="keypoints">
          <div class="kp-head">
            Did you say these? <span class="muted small">{hitCount}/{points.length}</span>
          </div>
          {points.map((p, i) => (
            <button
              key={i}
              class={'kp' + (ticked[i] ? ' on' : '')}
              onClick={() => setTicked((t) => ({ ...t, [i]: !t[i] }))}
            >
              <span class="kp-box">{ticked[i] ? '✓' : ''}</span>
              <span>{p}</span>
            </button>
          ))}
        </div>
      )}

      {q.deepDive && (
        <div class="deepdive">
          <button class="btn btn-ghost small" onClick={() => setDeep((d) => !d)}>
            {deep ? 'Hide' : 'If they push further →'}
          </button>
          {deep && <div class="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(q.deepDive) }} />}
        </div>
      )}

      {/* Keyed by question: GradeButtons holds a one-shot `fired` guard, and without a key Preact
          reuses the instance across cards, so the guard stays tripped and the first press on the
          next card is swallowed. Review keys it for the same reason. */}
      <GradeButtons key={q.id} srs={srs} id={q.id} onGrade={onGraded} />
      {points.length > 0 && hitCount < Math.ceil(points.length * 0.6) && (
        <p class="muted small center">
          You ticked {hitCount} of {points.length}, which is usually a miss.
        </p>
      )}
    </div>
  );
}

function Timer({ elapsed, target }: { elapsed: number; target: number }) {
  if (!target) return null;
  const over = elapsed > target;
  return (
    <div class={'timer' + (over ? ' over' : '')}>
      {String(Math.floor(elapsed / 60)).padStart(2, '0')}:{String(elapsed % 60).padStart(2, '0')}
      {over && <span class="muted small"> · you're rambling</span>}
    </div>
  );
}

// ---- end of run ----

function Summary({
  title,
  results,
  total,
  mode,
  onRetry,
}: {
  title: string;
  results: Record<string, boolean>;
  total: number;
  mode: Mode;
  onRetry: () => void;
}) {
  const hits = Object.values(results).filter(Boolean).length;
  const pct = total ? Math.round((hits / total) * 100) : 0;
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    (async () => {
      if (mode.kind !== 'stage') return;
      // Re-read attempts so the clear reflects the whole bank rather than this run alone.
      const [attempts, { loadIndex, loadAllBanks }] = await Promise.all([getAttempts(), import('../lib/content')]);
      const index = await loadIndex();
      const banks = await loadAllBanks(index);
      const qs = (banks[mode.moduleId]?.questions ?? []).filter((q) => q.tier === mode.tier);
      if (qs.length === 0) return;
      const nailed = qs.filter((q) => (attempts[q.id]?.hits ?? 0) > 0 && !attempts[q.id]?.burned).length;
      if (nailed / qs.length >= CLEAR_THRESHOLD) {
        const key = stageKey(mode.moduleId, mode.tier);
        await updateProgress((p) =>
          p.stagesCleared[key] ? p : { ...p, stagesCleared: { ...p.stagesCleared, [key]: Date.now() } },
        );
        setCleared(true);
      }
    })();
  }, [mode]);

  const msg = pct === 100 ? 'Flawless 💯' : pct >= 80 ? 'Strong 🎯' : pct >= 50 ? 'Getting there 💪' : 'Back to the guide 🔁';

  return (
    <section>
      <BackLink to={backFor(mode)} label="Back" />
      <h1>{title}</h1>
      <div class="result-card">
        <Ring pct={pct} />
        <div class="result-msg">{msg}</div>
        <div class="muted">
          {hits} of {total} nailed
        </div>
      </div>
      {cleared && (
        <div class="banner ok">
          <strong>Stage cleared.</strong> The next tier is open.
        </div>
      )}
      <button class="btn btn-primary" onClick={onRetry}>
        Run it again
      </button>
      <button class="btn btn-ghost" onClick={() => navigate(backFor(mode))}>
        Done
      </button>
    </section>
  );
}
