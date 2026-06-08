import { useEffect, useState } from 'preact/hooks';
import { loadIndex, loadLesson, loadQuiz, loadQuestionSet } from '../lib/content';
import { renderMarkdown } from '../lib/md';
import { navigate } from '../lib/router';
import { DOMAIN_LABEL, DOMAIN_ORDER } from '../lib/domains';
import { getProgress, recordStudy, updateProgress } from '../lib/db';
import type { ContentIndex, Domain, Quiz, QuestionSet } from '../lib/schema';

export function Learn() {
  const [index, setIndex] = useState<ContentIndex | null>(null);
  const [read, setRead] = useState<string[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadIndex().then(setIndex).catch(() => setError(true));
    getProgress().then((p) => setRead(p.lessonsRead));
  }, []);

  if (error) return <Empty title="Learn" note="Couldn't load content. Add content files and rebuild." />;
  if (!index) return <Loading />;

  const domains = DOMAIN_ORDER.filter(
    (d) =>
      index.lessons.some((l) => l.domain === d) ||
      index.quizzes.some((q) => q.domain === d) ||
      index.questionSets.some((q) => q.domain === d),
  );

  if (domains.length === 0)
    return <Empty title="Learn" note="No study content yet — it lands here as each domain is built." />;

  return (
    <section>
      <h1>Learn</h1>
      {domains.map((d) => (
        <DomainBlock key={d} domain={d} index={index} read={read} />
      ))}
    </section>
  );
}

function DomainBlock({ domain, index, read }: { domain: Domain; index: ContentIndex; read: string[] }) {
  const lessons = index.lessons.filter((l) => l.domain === domain).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const quizzes = index.quizzes.filter((q) => q.domain === domain);
  const qsets = index.questionSets.filter((q) => q.domain === domain);
  return (
    <div class="domain-block">
      <h2 class="domain-h">{DOMAIN_LABEL[domain]}</h2>
      <ul class="list">
        {lessons.map((l) => (
          <li key={l.id} onClick={() => navigate(`lesson/${l.id}`)}>
            <span>📖 {l.title}</span>
            <span class="row-meta">
              {read.includes(l.id) && <span class="pill ok">done</span>}
              {l.estMinutes ? <span class="muted small">{l.estMinutes}m</span> : null}
            </span>
          </li>
        ))}
        {qsets.map((q) => (
          <li key={q.id} onClick={() => navigate(`qset/${q.id}`)}>
            <span>🎤 {q.title}</span>
            <span class="pill">interview</span>
          </li>
        ))}
        {quizzes.map((q) => (
          <li key={q.id} onClick={() => navigate(`quiz/${q.id}`)}>
            <span>✅ {q.title}</span>
            <span class="pill">quiz</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Lesson({ id }: { id: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const index = await loadIndex();
        const ref = index.lessons.find((l) => l.id === id);
        if (!ref) throw new Error('not found');
        const { body } = await loadLesson(ref.path);
        if (alive) setHtml(renderMarkdown(body));
        const p = await getProgress();
        if (alive) setDone(p.lessonsRead.includes(id));
      } catch {
        if (alive) setError(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  async function markDone() {
    await updateProgress((p) => ({
      ...p,
      lessonsRead: p.lessonsRead.includes(id) ? p.lessonsRead : [...p.lessonsRead, id],
    }));
    await recordStudy(10);
    setDone(true);
  }

  if (error) return <Empty title="Lesson" note="Couldn't load this lesson." back="learn" />;
  if (html === null) return <Loading />;

  return (
    <section>
      <BackLink to="learn" label="Learn" />
      <article class="prose" dangerouslySetInnerHTML={{ __html: html }} />
      <div class="lesson-foot">
        <button class={'btn' + (done ? ' btn-ghost' : ' btn-primary')} onClick={markDone}>
          {done ? '✓ Completed' : 'Mark complete (+10 XP)'}
        </button>
      </div>
    </section>
  );
}

export function QuizRunner({ id }: { id: string }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState(false);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const index = await loadIndex();
        const ref = index.quizzes.find((q) => q.id === id);
        if (!ref) throw new Error('nf');
        const q = await loadQuiz(ref.path);
        if (alive) setQuiz(q);
      } catch {
        if (alive) setError(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (error) return <Empty title="Quiz" note="Couldn't load this quiz." back="learn" />;
  if (!quiz) return <Loading />;

  const total = quiz.questions.length;

  if (finished) {
    return (
      <section>
        <BackLink to="learn" label="Learn" />
        <h1>{quiz.title}</h1>
        <div class="result-card">
          <div class="result-score">
            {score} / {total}
          </div>
          <div class="muted">{Math.round((score / total) * 100)}% correct</div>
        </div>
        <button
          class="btn btn-primary"
          onClick={() => {
            setI(0);
            setScore(0);
            setAnswered(false);
            setFinished(false);
          }}
        >
          Retry
        </button>
      </section>
    );
  }

  const q = quiz.questions[i];
  const onResult = (correct: boolean) => {
    if (answered) return;
    setAnswered(true);
    if (correct) setScore((s) => s + 1);
  };
  const next = async () => {
    if (i + 1 >= total) {
      await recordStudy(15);
      await updateProgress((p) => ({
        ...p,
        quizAttempts: [...p.quizAttempts, { quizId: id, score, total, at: Date.now() }],
      }));
      setFinished(true);
    } else {
      setI(i + 1);
      setAnswered(false);
    }
  };

  return (
    <section>
      <BackLink to="learn" label="Learn" />
      <div class="quiz-progress">
        Question {i + 1} of {total} · Score {score}
      </div>
      <QuestionCard key={q.id} q={q} answered={answered} onResult={onResult} />
      {answered && (
        <button class="btn btn-primary" onClick={next}>
          {i + 1 >= total ? 'See results' : 'Next →'}
        </button>
      )}
    </section>
  );
}

function QuestionCard({
  q,
  answered,
  onResult,
}: {
  q: Quiz['questions'][number];
  answered: boolean;
  onResult: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [val, setVal] = useState('');
  const [revealed, setRevealed] = useState(false);

  if (q.type === 'mcq') {
    return (
      <div class="qcard">
        <p class="qprompt">{q.prompt}</p>
        <div class="choices">
          {q.choices.map((c, idx) => {
            let cls = 'choice';
            if (answered) {
              if (idx === q.answerIndex) cls += ' correct';
              else if (idx === picked) cls += ' wrong';
            } else if (idx === picked) cls += ' picked';
            return (
              <button
                key={idx}
                class={cls}
                disabled={answered}
                onClick={() => {
                  setPicked(idx);
                  onResult(idx === q.answerIndex);
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
        {answered && q.explanation && <div class="explain">{q.explanation}</div>}
      </div>
    );
  }

  if (q.type === 'numeric') {
    const num = parseFloat(val.replace(/[, $%]/g, ''));
    const correct = !isNaN(num) && Math.abs(num - q.answer) <= (q.tolerance ?? 0);
    return (
      <div class="qcard">
        <p class="qprompt">{q.prompt}</p>
        <div class="numrow">
          <input
            class="num-input"
            inputMode="decimal"
            placeholder={q.unit === '$' ? 'amount' : 'value'}
            value={val}
            disabled={answered}
            onInput={(e) => setVal((e.target as HTMLInputElement).value)}
          />
          {q.unit && <span class="unit">{q.unit}</span>}
          {!answered && (
            <button class="btn btn-primary" disabled={val === ''} onClick={() => onResult(correct)}>
              Check
            </button>
          )}
        </div>
        {answered && (
          <div class={'explain ' + (correct ? 'ok' : 'bad')}>
            {correct ? '✓ Correct.' : `Answer: ${formatAnswer(q.answer, q.unit)}.`} {q.explanation ?? ''}
          </div>
        )}
      </div>
    );
  }

  // free
  return (
    <div class="qcard">
      <p class="qprompt">{q.prompt}</p>
      {!revealed ? (
        <button
          class="btn btn-ghost"
          onClick={() => {
            setRevealed(true);
          }}
        >
          Reveal model answer
        </button>
      ) : (
        <>
          <div class="model-answer">{q.modelAnswer}</div>
          {!answered && (
            <div class="selfgrade">
              <button class="btn btn-ghost" onClick={() => onResult(false)}>
                Missed it
              </button>
              <button class="btn btn-primary" onClick={() => onResult(true)}>
                Got it
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function QuestionDrill({ id }: { id: string }) {
  const [set, setSet] = useState<QuestionSet | null>(null);
  const [error, setError] = useState(false);
  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const index = await loadIndex();
        const ref = index.questionSets.find((q) => q.id === id);
        if (!ref) throw new Error('nf');
        const s = await loadQuestionSet(ref.path);
        if (alive) setSet(s);
      } catch {
        if (alive) setError(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (error) return <Empty title="Interview Q&A" note="Couldn't load this set." back="learn" />;
  if (!set) return <Loading />;
  const q = set.questions[i];

  return (
    <section>
      <BackLink to="learn" label="Learn" />
      <h1>{set.title}</h1>
      <div class="quiz-progress">
        {i + 1} of {set.questions.length}
      </div>
      <div class="qcard">
        <p class="qprompt">{q.prompt}</p>
        {show ? (
          <div class="model-answer">{q.modelAnswer}</div>
        ) : (
          <button class="btn btn-ghost" onClick={() => setShow(true)}>
            Show model answer
          </button>
        )}
      </div>
      <div class="navrow">
        <button
          class="btn btn-ghost"
          disabled={i === 0}
          onClick={() => {
            setI(i - 1);
            setShow(false);
          }}
        >
          ← Prev
        </button>
        <button
          class="btn btn-primary"
          disabled={i + 1 >= set.questions.length}
          onClick={async () => {
            setI(i + 1);
            setShow(false);
            await recordStudy(2);
          }}
        >
          Next →
        </button>
      </div>
    </section>
  );
}

function formatAnswer(n: number, unit?: string): string {
  const s = Math.abs(n) >= 1000 ? n.toLocaleString('en-US', { maximumFractionDigits: 2 }) : String(n);
  return unit === '$' ? `$${s}` : unit ? `${s}${unit}` : s;
}

// ---- shared small components (used across views) ----
export function Loading() {
  return <div class="loading muted">Loading…</div>;
}
export function Empty({ title, note, back }: { title: string; note: string; back?: string }) {
  return (
    <section>
      {back && <BackLink to={back} label="Back" />}
      <h1>{title}</h1>
      <div class="banner info">{note}</div>
    </section>
  );
}
export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <button class="backlink" onClick={() => navigate(to)}>
      ‹ {label}
    </button>
  );
}
