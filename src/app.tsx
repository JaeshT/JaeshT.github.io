import { useEffect, useRef, useState } from 'preact/hooks';
import { useRoute, navigate, segments } from './lib/router';
import { setupPWA, isIOS, isStandalone } from './lib/pwa';
import { exportAll, importAll, updateProgress } from './lib/db';
import { Path, ModuleView } from './views/path';
import { StageDrill } from './views/drill';
import { Review, DangerReview } from './views/review';
import { Lesson } from './views/lesson';
import { Glossary } from './views/glossary';
import { Climb } from './views/climb';
import { AvatarCustomiser } from './views/avatar';
import { DownloadForOffline } from './views/offline';
import { BackLink, Empty, Loading, LoadError, Ring } from './views/ui';
import {
  coverage,
  dangerZone,
  dueQuestions,
  nextStage,
  readiness,
  tierProgress,
  weakestFirst,
} from './lib/curriculum';
import { progressionFor } from './lib/levels';
import { useLadder } from './lib/useLadder';
import { TIER_LABEL, TIERS, type Tier } from './lib/schema';

const NAV = [
  { tab: 'home', label: 'Home', icon: '🏠' },
  { tab: 'climb', label: 'Climb', icon: '🏔️' },
  { tab: 'path', label: 'Path', icon: '🗺️' },
  { tab: 'review', label: 'Review', icon: '🎯' },
  { tab: 'more', label: 'More', icon: '⋯' },
];

function tabFor(seg0: string): string {
  if (['path', 'module', 'lesson', 'drill'].includes(seg0)) return 'path';
  if (['review', 'danger'].includes(seg0)) return 'review';
  if (seg0 === 'climb') return 'climb';
  if (seg0 === 'home') return 'home';
  return 'more';
}

function isTier(s: string | undefined): s is Tier {
  return !!s && (TIERS as string[]).includes(s);
}

export function App() {
  const path = useRoute();
  const [seg0, seg1, seg2] = segments(path);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  const reload = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (tabFor(seg0 ?? 'home') !== 'climb') document.documentElement.classList.remove('tabs-hidden');
  }, [seg0]);

  useEffect(() => {
    reload.current = setupPWA(() => setNeedRefresh(true));
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  return (
    <div class="app">
      <header class="topbar">
        <span class="brand">IB&nbsp;Technicals</span>
        <span class="brand-sub">interview prep</span>
        {!online && <span class="offline-pill">● offline</span>}
      </header>

      <main class="content">
        <Router seg0={seg0 ?? 'home'} seg1={seg1} seg2={seg2} />
      </main>

      <nav class="tabbar">
        {NAV.map((n) => (
          <button
            key={n.tab}
            class={'tab' + (tabFor(seg0 ?? 'home') === n.tab ? ' active' : '')}
            onClick={() => navigate(n.tab)}
          >
            <span class="tab-icon">{n.icon}</span>
            <span class="tab-label">{n.label}</span>
          </button>
        ))}
      </nav>

      {needRefresh && (
        <div class="toast" role="status">
          <span>New version available.</span>
          <button onClick={() => reload.current?.()}>Reload</button>
        </div>
      )}
    </div>
  );
}

function Router({ seg0, seg1, seg2 }: { seg0: string; seg1?: string; seg2?: string }) {
  switch (seg0) {
    case 'home':
      return <Home />;
    case 'path':
      return <Path />;
    case 'module':
      return seg1 ? <ModuleView id={seg1} /> : <Path />;
    case 'drill':
      return seg1 && isTier(seg2) ? (
        <StageDrill moduleId={seg1} tier={seg2} />
      ) : (
        <Empty title="Drill" note="No stage selected." back="path" />
      );
    case 'review':
      return <Review />;
    case 'danger':
      return <DangerReview />;
    case 'lesson':
      return seg1 ? <Lesson id={seg1} /> : <Empty title="Primer" note="No primer selected." back="path" />;
    case 'climb':
      return <Climb />;
    case 'character':
      return <CharacterView />;
    case 'glossary':
      return <Glossary />;
    case 'progress':
      return <ProgressView />;
    case 'more':
      return <More />;
    default:
      return <Empty title="Not found" note="That page doesn't exist." back="home" />;
  }
}

function Home() {
  const { data, error } = useLadder();
  const [showIntro, setShowIntro] = useState(false);
  const [introChecked, setIntroChecked] = useState(false);

  // Show the explainer once. After that it lives behind the info button.
  useEffect(() => {
    if (!data || introChecked) return;
    setIntroChecked(true);
    if (!data.progress.introSeen) setShowIntro(true);
  }, [data, introChecked]);

  async function dismissIntro() {
    setShowIntro(false);
    await updateProgress((p) => ({ ...p, introSeen: true }));
  }

  if (error) return <LoadError title="Home" />;
  if (!data) return <Loading />;

  const score = readiness(data.modules);
  const next = nextStage(data.modules);
  const due = dueQuestions(data.banks, data.attempts, data.srs).length;
  const burned = dangerZone(data.banks, data.attempts).length;
  const nextModule = next && data.modules.find((m) => m.ref.id === next.moduleId);
  const cov = coverage(data.modules);
  const tiers = tierProgress(data.modules);
  const weakest = weakestFirst(data.modules);
  const rank = progressionFor(data.progress.xp).rank;

  // One recommendation, with the reason attached, so the first tap is never a decision.
  const rec = burned > 0
    ? { label: `Fix ${burned} burned question${burned === 1 ? '' : 's'}`, why: 'You said you knew these and then missed them.', go: 'danger' }
    : due > 0
      ? { label: `Review ${due} due`, why: 'These are fading. Reviewing now is worth more than new material.', go: 'review' }
      : next && nextModule
        ? { label: `${nextModule.ref.short} · ${TIER_LABEL[next.tier]}`, why: `${next.total - next.nailed} of ${next.total} still to nail in this stage.`, go: `drill/${next.moduleId}/${next.tier}` }
        : { label: 'Open the path', why: 'Pick where to go next.', go: 'path' };

  return (
    <section>
      <div class="home-head">
        <h1 class="home-title">Where you stand</h1>
        <button
          class="info-btn"
          aria-label="How this works"
          title="How this works"
          onClick={() => setShowIntro((v) => !v)}
        >
          i
        </button>
      </div>

      {showIntro && (
        <div class="explainer">
          <div class="explainer-head">
            <h2>How this works</h2>
            <button class="sheet-close" aria-label="Close" onClick={dismissIntro}>
              ✕
            </button>
          </div>
          <ol>
            <li>
              Questions are grouped into <strong>modules</strong>, each split into easy, medium and
              hard. Clear a tier to open the next.
            </li>
            <li>
              In a drill you commit to knowing the answer <em>before</em> the reveal, then grade
              yourself against the points an interviewer listens for.
            </li>
            <li>
              Readiness is what you could deliver today. It decays if you stop reviewing, so it is
              not a score you bank.
            </li>
          </ol>
          <button class="btn btn-ghost small" onClick={dismissIntro}>
            Got it
          </button>
        </div>
      )}

      <div class="hero">
        <Ring pct={score} label="ready" size={148} />
        <div class="hero-side">
          <div class="hero-rank">
            <span class="hero-rank-dot" style={{ background: rank.colour }} />
            {rank.title}
          </div>
          <div class="hero-nums">
            <span><strong>{data.progress.streak.count}</strong> day streak</span>
            <span><strong>{cov.nailed}</strong>/{cov.total} nailed</span>
          </div>
          <div class="muted small">
            Readiness is what you could deliver today, not what you once read.
          </div>
        </div>
      </div>

      <button class="btn btn-primary big rec" onClick={() => navigate(rec.go)}>
        <span class="rec-top">Next: {rec.label}</span>
        <span class="rec-why">{rec.why}</span>
      </button>

      <div class="quickrow">
        <button class="quick" onClick={() => navigate('review')} disabled={due === 0}>
          <span class="quick-n">{due}</span>
          <span class="quick-l">due for review</span>
        </button>
        <button class={'quick' + (burned ? ' danger' : '')} onClick={() => navigate('danger')} disabled={burned === 0}>
          <span class="quick-n">{burned}</span>
          <span class="quick-l">danger zone</span>
        </button>
      </div>

      <h2 class="section-h">Stages cleared</h2>
      <div class="tierrow">
        {tiers.map((t) => (
          <button key={t.tier} class={'tiercard ' + t.tier} onClick={() => navigate('climb')}>
            <span class="tiercard-top">
              <span class={'tier-badge ' + t.tier}>{TIER_LABEL[t.tier]}</span>
              <span class="muted small">{t.cleared}/{t.total}</span>
            </span>
            <span class="bar thin">
              <span class="bar-fill" style={{ width: (t.total ? (t.cleared / t.total) * 100 : 0) + '%' }} />
            </span>
            <span class="muted small">{t.nailed} of {t.questions} questions</span>
          </button>
        ))}
      </div>

      <h2 class="section-h">Weakest first</h2>
      <p class="muted small section-note">
        Sorted by how much of each module you could deliver right now.
      </p>
      <div class="mastery">
        {weakest.map((m) => (
          <button key={m.ref.id} class="mastery-row" onClick={() => navigate(`module/${m.ref.id}`)}>
            <div class="mastery-top">
              <span>
                {m.ref.icon} {m.ref.short}
              </span>
              <span class="row-meta">
                <span class="pips small-pips">
                  {m.stages.map((st) => (
                    <span key={st.tier} class={'minipip ' + st.tier + ' ' + st.status} />
                  ))}
                </span>
                <span class="muted small">{Math.round(m.strength * 100)}%</span>
              </span>
            </div>
            <div class="bar">
              <div class="bar-fill" style={{ width: Math.round(m.strength * 100) + '%' }} />
            </div>
          </button>
        ))}
      </div>

      <DownloadForOffline />
      <InstallHint />
    </section>
  );
}

function CharacterView() {
  return (
    <section>
      <BackLink to="climb" label="Climb" />
      <h1>Your climber</h1>
      <p class="muted">
        Appearance is yours to choose. Gear is earned: each rank adds a piece, so the figure on the
        climb shows how far you have got.
      </p>
      <AvatarCustomiser />
    </section>
  );
}

function More() {
  return (
    <section>
      <h1>More</h1>
      <ul class="list">
        <li onClick={() => navigate('character')}>🧑‍💼 Your climber</li>
        <li onClick={() => navigate('glossary')}>📖 Glossary</li>
        <li onClick={() => navigate('danger')}>⚠️ Danger zone</li>
        <li onClick={() => navigate('progress')}>📊 Progress &amp; backup</li>
      </ul>
      <p class="muted small">
        Tip: open this app once on WiFi before you travel. iOS clears offline data after about a week
        of not opening it.
      </p>
    </section>
  );
}

function ProgressView() {
  const [msg, setMsg] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function doExport() {
    const json = await exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ib-prep-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg('Exported backup.');
  }

  async function doImport(file: File) {
    try {
      await importAll(await file.text());
      setMsg('Imported. Reloading…');
      setTimeout(() => window.location.reload(), 600);
    } catch {
      setMsg('Import failed. That is not a valid backup file.');
    }
  }

  return (
    <section>
      <h1>Progress &amp; backup</h1>
      <DownloadForOffline />
      <p class="muted">
        Everything is stored locally on this device (no server). Export to back up or to sync between
        your Mac and iPhone.
      </p>
      <button class="btn btn-primary" onClick={doExport}>
        Export backup
      </button>
      <button class="btn btn-ghost" onClick={() => fileRef.current?.click()}>
        Import backup
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        style="display:none"
        onChange={(e) => {
          const f = (e.target as HTMLInputElement).files?.[0];
          if (f) doImport(f);
        }}
      />
      {msg && <div class="banner info">{msg}</div>}
    </section>
  );
}

function InstallHint() {
  if (isStandalone() || !isIOS()) return null;
  return (
    <div class="banner info">
      <strong>Install on iPhone:</strong> tap the Share button, then “Add to Home Screen” to use this
      fully offline.
    </div>
  );
}
