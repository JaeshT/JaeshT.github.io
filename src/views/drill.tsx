// The drill runner: the main study loop, and the thing that makes this not a flashcard app.
//
// Each question runs: commit → answer → grade.
//   1. COMMIT  you say out loud whether you know it, before seeing anything. A timer runs, because
//              in a real interview the silence is part of the question.
//   2. ANSWER  the say-it-out-loud model answer, plus the must-hit points as a checklist you tick
//              off against what you actually said. Auto-gradeable questions get checked properly.
//   3. GRADE   nailed or missed. Confident-then-missed marks the question "burned": it turns up
//              in the Danger Zone, because that combination is what actually loses interviews.

import { useEffect, useRef, useState } from 'preact/hooks';
import { navigate } from '../lib/router';
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

function backFor(mode: Mode): string {
  return mode.kind === 'stage' ? `module/${mode.moduleId}` : 'home';
}

function Drill({ mode }: { mode: Mode }) {
  const { data, error } = useLadder();
  const [pos, setPos] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [timerTarget, setTimerTarget] = useState(90);
  const grading = useRef(false);

  useEffect(() => {
    getSettings().then((s) => setTimerTarget(s.timerSeconds));
  }, []);

  // The queue is built once and then frozen. It used to be a useMemo over `data`, which looks
  // equivalent but is not: any reload of the ladder (a cloud sync applying a snapshot, say) handed
  // back a fresh `data`, the memo recomputed, and since the ordering puts unseen questions first,
  // grading a card reordered the list underneath the current index and the card visibly jumped.
  const frozen = useRef<{ queue: Question[]; anki: boolean } | null>(null);
  if (!frozen.current && data) {
    if (mode.kind === 'stage') {
      const bank = data.banks[mode.moduleId];
      const qs = bank ? bank.questions.filter((q) => q.tier === mode.tier) : [];
      const attempted = (q: Question) =>
        ((data.attempts[q.id]?.hits ?? 0) + (data.attempts[q.id]?.misses ?? 0)) > 0;
      const seen = (q: Question) => (data.attempts[q.id]?.hits ?? 0) > 0 && !data.attempts[q.id]?.burned;
      frozen.current = {
        // Unseen questions first: you make progress before you revise.
        queue: [...qs.filter((q) => !seen(q)), ...qs.filter(seen)],
        // Once every question here has been met once, the whole stage grades on the four-button
        // scale. Before that a first pass is just "did I know it", which is all you can honestly
        // say about material you have never seen.
        anki: qs.length > 0 && qs.every(attempted),
      };
    } else if (mode.kind === 'review') {
      frozen.current = { queue: dueQuestions(data.banks, data.attempts, data.srs), anki: true };
    } else {
      frozen.current = { queue: dangerZone(data.banks, data.attempts).map((d) => d.question), anki: true };
    }
  }
  const queue = frozen.current?.queue ?? null;
  const ankiGrading = frozen.current?.anki ?? false;

  if (error) return <LoadError title="Drill" back={backFor(mode)} />;
  if (!data || !queue) return <Loading />;

  const moduleTitle = mode.kind === 'stage' ? (data.modules.find((m) => m.ref.id === mode.moduleId)?.ref.short ?? '') : '';
  const title = titleFor(mode, moduleTitle);

  if (queue.length === 0) {
    const note =
      mode.kind === 'danger'
        ? 'Nothing burned. Questions land here when you claim you know one and then miss it.'
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

  async function onGraded(grade: Grade, confident: boolean) {
    // Guard against a second grade landing while the first is still writing: a double tap, or a
    // keypress arriving on a button that already has focus, used to advance two questions at once.
    if (grading.current) return;
    grading.current = true;
    try {
      const question = queue![pos];
      const hit = grade !== 'again';
      await recordAttempt(question.id, hit, confident);
      const srs = await getSrsMap();
      await setSrsState(question.id, srsReview(srs[question.id], grade));
      await recordStudy(hit ? 4 : 1);
      setResults((r) => ({ ...r, [question.id]: hit }));
      setPos((p) => p + 1);
    } finally {
      grading.current = false;
    }
  }

  return (
    <section>
      <BackLink to={backFor(mode)} label={mode.kind === 'stage' ? moduleTitle || 'Back' : 'Home'} />
      <div class="drill-head">
        <span class="muted small">{title}</span>
        <span class="muted small">
          {pos + 1} / {queue.length}
        </span>
      </div>
      <div class="bar thin">
        <div class="bar-fill" style={{ width: ((pos / queue.length) * 100).toFixed(1) + '%' }} />
      </div>
      <QuestionRunner
        key={q.id}
        q={q}
        timerTarget={timerTarget}
        ankiGrading={ankiGrading}
        srs={data.srs}
        onGraded={onGraded}
      />
    </section>
  );
}

// ---- one question ----

type Phase = 'commit' | 'answer';

function QuestionRunner({
  q,
  timerTarget,
  ankiGrading,
  srs,
  onGraded,
}: {
  q: Question;
  timerTarget: number;
  ankiGrading: boolean;
  srs: SrsMap;
  onGraded: (grade: Grade, confident: boolean) => void;
}) {
  const [phase, setPhase] = useState<Phase>('commit');
  const [confident, setConfident] = useState(false);
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

  const points = q.keyPoints ?? [];
  const hitCount = points.filter((_, i) => ticked[i]).length;

  function reveal(isConfident: boolean) {
    setConfident(isConfident);
    setPhase('answer');
  }

  // Auto-gradeable questions resolve objectively; everything else is an honest self-grade.
  if (q.check && phase === 'commit') {
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
            <button
              class="btn btn-primary big"
              onClick={() => onGraded(checkHit ? 'good' : 'again', false)}
            >
              Next →
            </button>
          </>
        )}
      </div>
    );
  }

  if (phase === 'commit') {
    return (
      <div class="qcard">
        <Timer elapsed={elapsed} target={timerTarget} />
        <p class="qprompt">{q.prompt}</p>
        <p class="muted small">Answer it out loud first. Then commit, honestly.</p>
        <div class="commit-row">
          <button class="btn btn-ghost" onClick={() => reveal(false)}>
            Not sure
          </button>
          <button class="btn btn-primary" onClick={() => reveal(true)}>
            I know this
          </button>
        </div>
      </div>
    );
  }

  return (
    <div class="qcard">
      <p class="qprompt">{q.prompt}</p>
      <div class="answer-label">
        {confident ? '🎯 You said you knew it' : '🤔 You said you were unsure'} · {elapsed}s
      </div>
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

      {ankiGrading ? (
        <GradeButtons srs={srs} id={q.id} onGrade={(g) => onGraded(g, confident)} />
      ) : (
        <div class="selfgrade">
          <button class="btn btn-ghost" onClick={() => onGraded('again', confident)}>
            Missed it
          </button>
          <button class="btn btn-primary" onClick={() => onGraded('good', confident)}>
            Nailed it →
          </button>
        </div>
      )}
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
