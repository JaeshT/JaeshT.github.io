import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { loadIndex, loadBriefing, loadGlossaries } from '../lib/content';
import { renderMarkdown } from '../lib/md';
import { navigate } from '../lib/router';
import { recordStudy } from '../lib/db';
import type { Briefing, GlossaryTerm } from '../lib/schema';
import { Loading, Empty, BackLink } from './learn';

export function Briefings() {
  const [refs, setRefs] = useState<{ id: string; title: string; updated?: string }[] | null>(null);
  useEffect(() => {
    loadIndex()
      .then((i) => setRefs(i.briefings ?? []))
      .catch(() => setRefs([]));
  }, []);
  if (!refs) return <Loading />;
  if (refs.length === 0) return <Empty title="Briefings" note="Market briefings appear here." back="home" />;
  return (
    <section>
      <h1>📰 Market Briefings</h1>
      <ul class="list">
        {refs.map((r) => (
          <li key={r.id} onClick={() => navigate(`brief/${r.id}`)}>
            <span>{r.title}</span>
            {r.updated && <span class="muted small">{r.updated}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---- helpers ----
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Wrap the first global occurrence of each glossary term (in text, not tags) with a tappable button. */
function linkifyGlossary(html: string, terms: GlossaryTerm[], used: Set<string>): string {
  if (terms.length === 0) return html;
  const cands = terms.filter((t) => t.term.length >= 3).sort((a, b) => b.term.length - a.term.length);
  let re: RegExp;
  try {
    re = new RegExp('\\b(' + cands.map((t) => escapeRe(t.term)).join('|') + ')\\b', 'gi');
  } catch {
    return html;
  }
  const parts = html.split(/(<[^>]+>)/); // even indices = text, odd = tags
  for (let i = 0; i < parts.length; i += 2) {
    parts[i] = parts[i].replace(re, (m) => {
      const key = m.toLowerCase();
      if (used.has(key)) return m;
      used.add(key);
      return `<button type="button" class="gterm-link" data-term="${key}">${m}</button>`;
    });
  }
  return parts.join('');
}

function parseStat(v: string) {
  const m = String(v).match(/^([^\d-]*)(-?[\d,]*\.?\d+)(.*)$/);
  if (!m) return null;
  const raw = m[2];
  const num = parseFloat(raw.replace(/,/g, ''));
  if (isNaN(num)) return null;
  return { prefix: m[1], suffix: m[3], num, decimals: (raw.split('.')[1] || '').length, commas: raw.includes(',') };
}
function fmtNum(n: number, decimals: number, commas: boolean): string {
  const s = n.toFixed(decimals);
  return commas
    ? Number(s).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : s;
}

function StatCard({ stat }: { stat: Briefing['stats'][number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const parsed = useMemo(() => parseStat(stat.value), [stat.value]);
  const [disp, setDisp] = useState(parsed ? parsed.prefix + fmtNum(0, parsed.decimals, parsed.commas) + parsed.suffix : stat.value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !parsed) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const dur = 900;
        const t0 = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisp(parsed.prefix + fmtNum(parsed.num * eased, parsed.decimals, parsed.commas) + parsed.suffix);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [parsed]);

  return (
    <div ref={ref} class="stat-card reveal">
      <div class="stat-card-value">{disp}</div>
      <div class="stat-card-label">{stat.label}</div>
      {stat.note && <div class="stat-card-note">{stat.note}</div>}
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 40 });
  const colors = ['#5b8cff', '#36d399', '#f0b429', '#f06b6b', '#b388ff'];
  return (
    <div class="confetti" aria-hidden="true">
      {pieces.map((_, i) => (
        <span
          key={i}
          style={{
            left: Math.random() * 100 + '%',
            background: colors[i % colors.length],
            animationDelay: Math.random() * 0.4 + 's',
            animationDuration: 1.8 + Math.random() * 1.2 + 's',
          }}
        />
      ))}
    </div>
  );
}

export function Brief({ id }: { id: string }) {
  const [brief, setBrief] = useState<Briefing | null>(null);
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [error, setError] = useState(false);
  const [tag, setTag] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [sheet, setSheet] = useState<{ term: string; def: string } | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const index = await loadIndex();
        const ref = index.briefings?.find((b) => b.id === id);
        if (!ref) throw new Error('nf');
        const [b, g] = await Promise.all([
          loadBriefing(ref.path),
          index.glossary ? loadGlossaries(index.glossary.paths) : Promise.resolve({ terms: [] }),
        ]);
        if (!alive) return;
        setBrief(b);
        setTerms(g.terms);
        recordStudy(5);
      } catch {
        if (alive) setError(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  // glossary lookup + content with first-occurrence terms linkified (shared "used" set across blocks)
  const defMap = useMemo(() => {
    const m = new Map<string, string>();
    terms.forEach((t) => m.set(t.term.toLowerCase(), t.definition));
    return m;
  }, [terms]);

  const content = useMemo(() => {
    if (!brief) return { intro: '', sections: [] as string[] };
    const used = new Set<string>();
    const intro = brief.intro ? linkifyGlossary(renderMarkdown(brief.intro), terms, used) : '';
    const sections = brief.sections.map((s) => linkifyGlossary(renderMarkdown(s.body), terms, used));
    return { intro, sections };
  }, [brief, terms]);

  // scroll → progress bar + completion celebration
  useEffect(() => {
    if (!brief) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 1;
      setProgress(p);
      if (p >= 0.985 && !doneRef.current) {
        doneRef.current = true;
        setDone(true);
        setConfetti(true);
        recordStudy(10);
        setTimeout(() => setConfetti(false), 2600);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [brief]);

  // reveal-on-scroll for .reveal elements
  useEffect(() => {
    if (!brief || !rootRef.current) return;
    const els = rootRef.current.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [brief, content]);

  const readMins = useMemo(() => {
    if (!brief) return 0;
    const words = (brief.intro || '' + brief.sections.map((s) => s.body).join(' ') + brief.talkingPoints.map((t) => t.text).join(' ')).split(/\s+/).length;
    const total = brief.sections.reduce((n, s) => n + s.body.split(/\s+/).length, 0) + words;
    return Math.max(2, Math.round(total / 200));
  }, [brief]);

  const onContentClick = (e: MouseEvent) => {
    const t = (e.target as HTMLElement).closest('.gterm-link') as HTMLElement | null;
    if (!t) return;
    e.preventDefault();
    const key = t.dataset.term || '';
    const def = defMap.get(key);
    if (def) setSheet({ term: t.textContent || key, def });
  };

  async function copyPoint(text: string, i: number) {
    try {
      await navigator.clipboard?.writeText(text);
      setCopied(i);
      setTimeout(() => setCopied((c) => (c === i ? null : c)), 1300);
    } catch {
      /* clipboard unavailable */
    }
  }

  if (error) return <Empty title="Briefing" note="Couldn't load this briefing." back="home" />;
  if (!brief) return <Loading />;

  const tags = [...new Set(brief.talkingPoints.map((t) => t.tag).filter(Boolean))] as string[];
  const points = tag ? brief.talkingPoints.filter((t) => t.tag === tag) : brief.talkingPoints;

  return (
    <section class="brief" ref={rootRef}>
      <div class="read-progress" style={{ transform: `scaleX(${progress})` }} />
      {confetti && <Confetti />}

      <BackLink to="learn" label="Learn" />
      <h1>{brief.title}</h1>
      <p class="brief-updated">
        Updated {brief.updated} · {readMins} min read{done && <span class="read-done"> · ✓ read</span>}
      </p>
      {content.intro && (
        <div class="brief-intro prose" onClick={onContentClick} dangerouslySetInnerHTML={{ __html: content.intro }} />
      )}

      {brief.stats.length > 0 && (
        <>
          <h2 class="section-h">By the numbers</h2>
          <div class="stat-board">
            {brief.stats.map((s, i) => (
              <StatCard key={i} stat={s} />
            ))}
          </div>
        </>
      )}

      {brief.sections.map((sec, i) => (
        <div key={i} class="brief-section reveal">
          <h2 class="brief-h">{sec.heading}</h2>
          <div class="prose" onClick={onContentClick} dangerouslySetInnerHTML={{ __html: content.sections[i] }} />
        </div>
      ))}

      {brief.talkingPoints.length > 0 && (
        <>
          <h2 class="section-h">Talking points</h2>
          <p class="muted small">Conversation-ready lines — tap to copy.</p>
          {tags.length > 0 && (
            <div class="chips">
              <button class={'chip' + (tag === null ? ' on' : '')} onClick={() => setTag(null)}>All</button>
              {tags.map((t) => (
                <button key={t} class={'chip' + (tag === t ? ' on' : '')} onClick={() => setTag(tag === t ? null : t)}>
                  {t}
                </button>
              ))}
            </div>
          )}
          <div class="talking-points">
            {points.map((p, i) => (
              <button key={i} class="tp reveal" onClick={() => copyPoint(p.text, i)}>
                <span class="tp-dot">▸</span>
                <span class="tp-text">{p.text}</span>
                <span class="tp-copy">{copied === i ? '✓ copied' : '⧉'}</span>
                {p.tag && <span class="tp-tag">{p.tag}</span>}
              </button>
            ))}
          </div>
        </>
      )}

      {done && (
        <div class="brief-complete reveal revealed">
          🎉 <strong>Briefing complete.</strong> You're caught up on the market — +10 XP.
        </div>
      )}

      {sheet && (
        <div class="sheet-backdrop" onClick={() => setSheet(null)}>
          <div class="sheet" onClick={(e) => e.stopPropagation()}>
            <div class="sheet-term">{sheet.term}</div>
            <div class="sheet-def">{sheet.def}</div>
            <button class="btn btn-primary" onClick={() => setSheet(null)}>Got it</button>
          </div>
        </div>
      )}
    </section>
  );
}
