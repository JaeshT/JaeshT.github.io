import { useEffect, useRef, useState } from 'preact/hooks';
import { useRoute, navigate, segments } from './lib/router';
import { setupPWA, isIOS, isStandalone } from './lib/pwa';
import { exportAll, importAll } from './lib/db';
import { Path, ModuleView } from './views/path';
import { StageDrill, ReviewDrill, DangerDrill } from './views/drill';
import { Lesson } from './views/lesson';
import { Glossary } from './views/glossary';
import { DownloadForOffline } from './views/offline';
import { Empty, Loading, LoadError, Ring } from './views/ui';
import { dangerZone, dueQuestions, nextStage, readiness } from './lib/curriculum';
import { useLadder } from './lib/useLadder';
import { TIER_LABEL, TIERS, type Tier } from './lib/schema';

const NAV = [
  { tab: 'home', label: 'Home', icon: '🏠' },
  { tab: 'path', label: 'Path', icon: '🗺️' },
  { tab: 'review', label: 'Review', icon: '🎯' },
  { tab: 'glossary', label: 'Terms', icon: '📖' },
  { tab: 'more', label: 'More', icon: '⋯' },
];

function tabFor(seg0: string): string {
  if (['path', 'module', 'lesson', 'drill'].includes(seg0)) return 'path';
  if (['review', 'danger'].includes(seg0)) return 'review';
  if (seg0 === 'glossary') return 'glossary';
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
      return <ReviewDrill />;
    case 'danger':
      return <DangerDrill />;
    case 'lesson':
      return seg1 ? <Lesson id={seg1} /> : <Empty title="Primer" note="No primer selected." back="path" />;
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

  if (error) return <LoadError title="Home" />;
  if (!data) return <Loading />;

  const score = readiness(data.modules);
  const next = nextStage(data.modules);
  const due = dueQuestions(data.banks, data.attempts, data.srs).length;
  const burned = dangerZone(data.banks, data.attempts).length;
  const nextModule = next && data.modules.find((m) => m.ref.id === next.moduleId);

  return (
    <section>
      <div class="hero">
        <Ring pct={score} label="ready" size={160} />
        <div class="hero-side">
          <div class="hero-stat">
            <strong>{data.progress.streak.count}</strong> day streak 🔥
          </div>
          <div class="hero-stat">
            <strong>{data.progress.xp}</strong> XP
          </div>
          <div class="hero-stat muted small">
            Readiness decays if you stop reviewing. It's what you could deliver today, not what you
            once read.
          </div>
        </div>
      </div>

      {next && nextModule ? (
        <button
          class="btn btn-primary big"
          onClick={() => navigate(`drill/${next.moduleId}/${next.tier}`)}
        >
          Next up: {nextModule.ref.short} · {TIER_LABEL[next.tier]} ({next.nailed}/{next.total})
        </button>
      ) : (
        <button class="btn btn-primary big" onClick={() => navigate('path')}>
          Open the path →
        </button>
      )}

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

      <h2 class="section-h">Where you are</h2>
      <div class="mastery">
        {data.modules
          .filter((m) => m.ready)
          .map((m) => (
            <button key={m.ref.id} class="mastery-row" onClick={() => navigate(`module/${m.ref.id}`)}>
              <div class="mastery-top">
                <span>
                  {m.ref.icon} {m.ref.short}
                </span>
                <span class="muted small">{Math.round(m.strength * 100)}%</span>
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

function More() {
  return (
    <section>
      <h1>More</h1>
      <ul class="list">
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
