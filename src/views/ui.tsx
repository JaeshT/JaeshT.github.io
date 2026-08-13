// Small shared presentational pieces used across views.
import { navigate } from '../lib/router';

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

/** The message shown when content can't be fetched. Different advice online vs. offline. */
export function LoadError({ title, back }: { title: string; back?: string }) {
  return (
    <Empty
      title={title}
      back={back}
      note={
        navigator.onLine
          ? 'Could not load content. Try again.'
          : 'You are offline and the content is not downloaded yet. Reconnect, open Home, and tap "Download for offline".'
      }
    />
  );
}

/**
 * Switch between the two views of the same curriculum. The path is the list, the climb is the
 * map; they show identical stages, which is worth making obvious rather than leaving implied.
 */
export function ViewToggle({ active }: { active: 'path' | 'climb' }) {
  return (
    <div class="viewtoggle" role="tablist">
      <button
        role="tab"
        aria-selected={active === 'path'}
        class={active === 'path' ? 'on' : ''}
        onClick={() => navigate('path')}
      >
        List
      </button>
      <button
        role="tab"
        aria-selected={active === 'climb'}
        class={active === 'climb' ? 'on' : ''}
        onClick={() => navigate('climb')}
      >
        Climb
      </button>
    </div>
  );
}

/** Circular gauge. Used for the readiness score and end-of-stage results. */
export function Ring({ pct, label, size = 140 }: { pct: number; label?: string; size?: number }) {
  const r = size * 0.37;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
  const color = pct >= 80 ? 'var(--accent-2)' : pct >= 50 ? 'var(--accent)' : 'var(--warn)';
  const mid = size / 2;
  return (
    <svg class="score-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={mid} cy={mid} r={r} fill="none" stroke="var(--border)" stroke-width={size * 0.086} />
      <circle
        cx={mid}
        cy={mid}
        r={r}
        fill="none"
        stroke={color}
        stroke-width={size * 0.086}
        stroke-linecap="round"
        stroke-dasharray={c}
        stroke-dashoffset={off}
        transform={`rotate(-90 ${mid} ${mid})`}
      />
      <text x={mid} y={mid + size * 0.06} text-anchor="middle" class="ring-text">
        {pct}%
      </text>
      {label && (
        <text x={mid} y={mid + size * 0.22} text-anchor="middle" class="ring-label">
          {label}
        </text>
      )}
    </svg>
  );
}
