import { useEffect, useState } from 'preact/hooks';
import { useRoute, navigate } from './lib/router';
import { setupPWA, isIOS, isStandalone } from './lib/pwa';
import { loadIndex } from './lib/content';
import { getProgress } from './lib/db';
import type { ContentIndex } from './lib/schema';

const NAV = [
  { route: 'home', label: 'Home', icon: '🏠' },
  { route: 'learn', label: 'Learn', icon: '📚' },
  { route: 'cards', label: 'Cards', icon: '🃏' },
  { route: 'tools', label: 'Tools', icon: '🧮' },
  { route: 'more', label: 'More', icon: '⋯' },
];

export function App() {
  const route = useRoute();
  const [needRefresh, setNeedRefresh] = useState(false);
  const [reload, setReload] = useState<(() => void) | null>(null);

  useEffect(() => {
    const activate = setupPWA(() => setNeedRefresh(true));
    setReload(() => activate);
  }, []);

  return (
    <div class="app">
      <header class="topbar">
        <span class="brand">PE&nbsp;Prep</span>
        <span class="brand-sub">Primaries &amp; Co-investments</span>
      </header>

      <main class="content">
        {route === 'home' && <Home />}
        {route === 'learn' && <Placeholder title="Learn" note="Lessons, the question bank and quizzes land here once research content is loaded (Phase 1–2)." />}
        {route === 'cards' && <Placeholder title="Flashcards" note="Spaced-repetition flashcards with rich card types arrive in Phase 1." />}
        {route === 'tools' && <Placeholder title="Interactive tools" note="J-curve visualizer, waterfall splitter, IRR/MOIC calculator, mini-LBO and pacing simulator — Phase 3." />}
        {route === 'more' && <More />}
        {!NAV.some((n) => n.route === route) && <Placeholder title="Not found" note="That page doesn't exist yet." />}
      </main>

      <nav class="tabbar">
        {NAV.map((n) => (
          <button
            key={n.route}
            class={'tab' + (route === n.route ? ' active' : '')}
            onClick={() => navigate(n.route)}
          >
            <span class="tab-icon">{n.icon}</span>
            <span class="tab-label">{n.label}</span>
          </button>
        ))}
      </nav>

      {needRefresh && (
        <div class="toast" role="status">
          <span>New version available.</span>
          <button onClick={() => reload?.()}>Reload</button>
        </div>
      )}
    </div>
  );
}

function Home() {
  const [index, setIndex] = useState<ContentIndex | null>(null);
  const [error, setError] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    loadIndex().then(setIndex).catch(() => setError(true));
    getProgress().then((p) => setStreak(p.streak.count));
  }, []);

  const counts = index
    ? {
        lessons: index.lessons.length,
        decks: index.flashcardDecks.length,
        quizzes: index.quizzes.length,
        excel: index.excel.length,
      }
    : null;

  return (
    <section>
      <h1>Welcome back 👋</h1>
      <p class="muted">
        Your offline prep for the Neuberger Berman Primaries &amp; Co-investments internship.
      </p>

      <div class="cardgrid">
        <Stat label="Day streak" value={String(streak)} accent />
        <Stat label="Lessons" value={counts ? String(counts.lessons) : '–'} />
        <Stat label="Card decks" value={counts ? String(counts.decks) : '–'} />
        <Stat label="Quizzes" value={counts ? String(counts.quizzes) : '–'} />
      </div>

      {error && (
        <div class="banner warn">Couldn't load content index. (Expected until content is added.)</div>
      )}

      <div class="banner ok">
        <strong>Offline ready.</strong> This is the app shell (Phase 0). Study content gets added
        once the deep-research reports come back.
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
        <li onClick={() => navigate('glossary')}>📖 Glossary <span class="soon">soon</span></li>
        <li onClick={() => navigate('progress')}>📊 Progress &amp; backup <span class="soon">soon</span></li>
        <li onClick={() => navigate('settings')}>⚙️ Settings <span class="soon">soon</span></li>
      </ul>
      <p class="muted small">
        Tip: open this app once on WiFi before you travel — iOS clears offline data after about a
        week of not opening it.
      </p>
    </section>
  );
}

function InstallHint() {
  if (isStandalone() || !isIOS()) return null;
  return (
    <div class="banner info">
      <strong>Install on iPhone:</strong> tap the Share button, then “Add to Home Screen” to use
      this fully offline.
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

function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <section>
      <h1>{title}</h1>
      <div class="banner info">{note}</div>
    </section>
  );
}
