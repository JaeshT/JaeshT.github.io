import { useEffect, useMemo, useState } from 'preact/hooks';
import { loadIndex, loadBriefing } from '../lib/content';
import { renderMarkdown } from '../lib/md';
import { navigate } from '../lib/router';
import { recordStudy } from '../lib/db';
import type { Briefing } from '../lib/schema';
import { Loading, Empty, BackLink } from './learn';

/** List of available briefings (shown if there's more than one; otherwise we deep-link). */
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

export function Brief({ id }: { id: string }) {
  const [brief, setBrief] = useState<Briefing | null>(null);
  const [error, setError] = useState(false);
  const [tag, setTag] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const index = await loadIndex();
        const ref = index.briefings?.find((b) => b.id === id);
        if (!ref) throw new Error('nf');
        const b = await loadBriefing(ref.path);
        if (alive) setBrief(b);
        recordStudy(5); // reading market context counts toward XP/streak
      } catch {
        if (alive) setError(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const tags = useMemo(() => {
    if (!brief) return [];
    const s = new Set<string>();
    brief.talkingPoints.forEach((t) => t.tag && s.add(t.tag));
    return [...s].sort();
  }, [brief]);

  if (error) return <Empty title="Briefing" note="Couldn't load this briefing." back="home" />;
  if (!brief) return <Loading />;

  const points = tag ? brief.talkingPoints.filter((t) => t.tag === tag) : brief.talkingPoints;

  return (
    <section class="brief">
      <BackLink to="learn" label="Learn" />
      <h1>{brief.title}</h1>
      <p class="brief-updated">Updated {brief.updated}</p>
      {brief.intro && (
        <div class="brief-intro prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(brief.intro) }} />
      )}

      {brief.stats.length > 0 && (
        <>
          <h2 class="section-h">By the numbers</h2>
          <div class="stat-board">
            {brief.stats.map((s, i) => (
              <div key={i} class="stat-card">
                <div class="stat-card-value">{s.value}</div>
                <div class="stat-card-label">{s.label}</div>
                {s.note && <div class="stat-card-note">{s.note}</div>}
              </div>
            ))}
          </div>
        </>
      )}

      {brief.sections.map((sec, i) => (
        <div key={i} class="brief-section">
          <h2 class="brief-h">{sec.heading}</h2>
          <div class="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(sec.body) }} />
        </div>
      ))}

      {brief.talkingPoints.length > 0 && (
        <>
          <h2 class="section-h">Talking points</h2>
          <p class="muted small">Conversation-ready lines for the desk or an interview.</p>
          {tags.length > 0 && (
            <div class="chips">
              <button class={'chip' + (tag === null ? ' on' : '')} onClick={() => setTag(null)}>
                All
              </button>
              {tags.map((t) => (
                <button key={t} class={'chip' + (tag === t ? ' on' : '')} onClick={() => setTag(tag === t ? null : t)}>
                  {t}
                </button>
              ))}
            </div>
          )}
          <div class="talking-points">
            {points.map((p, i) => (
              <div key={i} class="tp">
                <span class="tp-dot">▸</span>
                <span class="tp-text">{p.text}</span>
                {p.tag && <span class="tp-tag">{p.tag}</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
