import { useEffect, useRef, useState } from 'preact/hooks';
import { useRoute, navigate, segments } from './lib/router';
import { setupPWA, isIOS, isStandalone } from './lib/pwa';
import { loadIndex, loadDeck } from './lib/content';
import { getProgress, exportAll, importAll } from './lib/db';
import { isDue } from './lib/srs';
import { Learn, Lesson, QuizRunner, QuestionDrill, MockInterview, Empty } from './views/learn';
import { Cards, Review, Browse } from './views/cards';
import { Glossary } from './views/glossary';
import { Tools, WaterfallTool, MetricsTool } from './views/tools';
import { DOMAIN_LABEL, DOMAIN_ORDER } from './lib/domains';
import { computeMastery, computeAchievements, isLearned, type DomainMastery, type Achievement } from './lib/mastery';
import type { FlashcardDeck } from './lib/schema';

const NAV = [
  { tab: 'home', label: 'Home', icon: '🏠' },
  { tab: 'learn', label: 'Learn', icon: '📚' },
  { tab: 'cards', label: 'Cards', icon: '🃏' },
  { tab: 'tools', label: 'Tools', icon: '🧮' },
  { tab: 'more', label: 'More', icon: '⋯' },
];

function tabFor(seg0: string): string {
  if (['learn', 'lesson', 'quiz', 'qset', 'mock'].includes(seg0)) return 'learn';
  if (['cards', 'review', 'browse'].includes(seg0)) return 'cards';
  if (seg0 === 'tools') return 'tools';
  if (seg0 === 'home') return 'home';
  return 'more';
}

export function App() {
  const path = useRoute();
  const [seg0, seg1] = segments(path);
  const [needRefresh, setNeedRefresh] = useState(false);
  const reload = useRef<(() => void) | null>(null);

  useEffect(() => {
    reload.current = setupPWA(() => setNeedRefresh(true));
  }, []);

  return (
    <div class="app">
      <header class="topbar">
        <span class="brand">PE&nbsp;Prep</span>
        <span class="brand-sub">Primaries &amp; Co-investments</span>
      </header>

      <main class="content">
        <Router seg0={seg0 ?? 'home'} seg1={seg1} />
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

function Router({ seg0, seg1 }: { seg0: string; seg1?: string }) {
  switch (seg0) {
    case 'home':
      return <Home />;
    case 'learn':
      return <Learn />;
    case 'lesson':
      return seg1 ? <Lesson id={seg1} /> : <Empty title="Lesson" note="No lesson selected." back="learn" />;
    case 'quiz':
      return seg1 ? <QuizRunner id={seg1} /> : <Empty title="Quiz" note="No quiz selected." back="learn" />;
    case 'qset':
      return seg1 ? <QuestionDrill id={seg1} /> : <Empty title="Q&A" note="No set selected." back="learn" />;
    case 'mock':
      return <MockInterview />;
    case 'cards':
      return <Cards />;
    case 'review':
      return <Review deckId={seg1} />;
    case 'browse':
      return seg1 ? <Browse deckId={seg1} /> : <Empty title="Browse" note="No deck selected." back="cards" />;
    case 'tools':
      if (seg1 === 'waterfall') return <WaterfallTool />;
      if (seg1 === 'pme') return <MetricsTool />;
      return <Tools />;
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
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [due, setDue] = useState(0);
  const [learned, setLearned] = useState(0);
  const [masteries, setMasteries] = useState<DomainMastery[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const idx = await loadIndex();
        const { getSrsMap } = await import('./lib/db');
        const [srs, progress] = await Promise.all([getSrsMap(), getProgress()]);
        const deckList = await Promise.all(idx.flashcardDecks.map((d) => loadDeck(d.path)));
        const byId: Record<string, FlashcardDeck> = {};
        idx.flashcardDecks.forEach((ref, n) => (byId[ref.id] = deckList[n]));
        const allCards = deckList.flatMap((d) => d.cards);
        const learnedCount = allCards.filter((c) => isLearned(srs, c.id)).length;
        const ms = computeMastery(idx, byId, srs, progress);
        setDue(allCards.filter((c) => isDue(srs[c.id])).length);
        setLearned(learnedCount);
        setStreak(progress.streak.count);
        setXp(progress.xp);
        setMasteries(ms);
        setAchievements(computeAchievements(progress, learnedCount, ms));
      } catch {
        /* content not loaded yet */
      }
    })();
  }, []);

  const ordered = DOMAIN_ORDER.map((d) => masteries.find((m) => m.domain === d)).filter(Boolean) as DomainMastery[];

  return (
    <section>
      <h1>Welcome back 👋</h1>
      <p class="muted">Offline prep for the Neuberger Berman Primaries &amp; Co-investments internship.</p>

      <div class="cardgrid">
        <Stat label="Day streak" value={String(streak)} accent />
        <Stat label="XP" value={String(xp)} />
        <Stat label="Cards due" value={String(due)} />
        <Stat label="Cards learned" value={String(learned)} />
      </div>

      <button class="btn btn-primary big" disabled={due === 0} onClick={() => navigate('review')}>
        {due > 0 ? `Review ${due} due card${due === 1 ? '' : 's'}` : 'No cards due — explore a lesson'}
      </button>

      {achievements.some((a) => a.earned) && (
        <div class="badge-row">
          {achievements.map((a) => (
            <div key={a.id} class={'badge' + (a.earned ? ' earned' : '')} title={`${a.label} — ${a.desc}`}>
              <span class="badge-icon">{a.icon}</span>
              <span class="badge-label">{a.label}</span>
            </div>
          ))}
        </div>
      )}

      {ordered.length > 0 && (
        <div class="mastery">
          <h2 class="section-h">Mastery</h2>
          {ordered.map((m) => (
            <button key={m.domain} class="mastery-row" onClick={() => navigate('learn')}>
              <div class="mastery-top">
                <span>{DOMAIN_LABEL[m.domain]}</span>
                <span class="muted small">{m.pct}%</span>
              </div>
              <div class="bar">
                <div class="bar-fill" style={{ width: m.pct + '%' }} />
              </div>
            </button>
          ))}
        </div>
      )}

      <div class="quicklinks">
        <button onClick={() => navigate('mock')}>🎤 Mock interview</button>
        <button onClick={() => navigate('tools/pme')}>📈 PME calc</button>
        <button onClick={() => navigate('tools/waterfall')}>💧 Waterfall</button>
        <button onClick={() => navigate('glossary')}>📖 Glossary</button>
      </div>

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
        <li onClick={() => navigate('progress')}>📊 Progress &amp; backup</li>
      </ul>
      <p class="muted small">
        Tip: open this app once on WiFi before you travel — iOS clears offline data after about a week
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
    a.download = `pe-prep-backup-${new Date().toISOString().slice(0, 10)}.json`;
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
      setMsg('Import failed — not a valid backup file.');
    }
  }

  return (
    <section>
      <h1>Progress &amp; backup</h1>
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

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div class={'stat' + (accent ? ' accent' : '')}>
      <div class="stat-value">{value}</div>
      <div class="stat-label">{label}</div>
    </div>
  );
}
