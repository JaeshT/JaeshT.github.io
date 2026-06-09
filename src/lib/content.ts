// Loads the content manifest and individual content files at runtime via fetch.
// Files are precached by the service worker, so this works fully offline after first load.

import type {
  Briefing,
  ContentIndex,
  FlashcardDeck,
  Glossary,
  QuestionSet,
  Quiz,
} from './schema';

const BASE = '/content/';

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(BASE + path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

async function fetchText(path: string): Promise<string> {
  const res = await fetch(BASE + path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.text();
}

let indexCache: ContentIndex | null = null;

export async function loadIndex(): Promise<ContentIndex> {
  if (!indexCache) indexCache = await fetchJson<ContentIndex>('index.json');
  return indexCache;
}

export const loadDeck = (path: string) => fetchJson<FlashcardDeck>(path);
export const loadQuestionSet = (path: string) => fetchJson<QuestionSet>(path);
export const loadQuiz = (path: string) => fetchJson<Quiz>(path);
export const loadBriefing = (path: string) => fetchJson<Briefing>(path);
export const loadGlossary = (path: string) => fetchJson<Glossary>(path);

/** Load and merge multiple per-domain glossary files, de-duplicating by term (case-insensitive). */
export async function loadGlossaries(paths: string[]): Promise<Glossary> {
  const parts = await Promise.all(paths.map((p) => fetchJson<Glossary>(p)));
  const byTerm = new Map<string, Glossary['terms'][number]>();
  for (const g of parts) {
    for (const t of g.terms) {
      const key = t.term.trim().toLowerCase();
      if (!byTerm.has(key)) byTerm.set(key, t);
    }
  }
  return { terms: [...byTerm.values()] };
}

/** Lessons are markdown with optional YAML-ish frontmatter; return {meta, body}. */
export async function loadLesson(path: string): Promise<{ body: string }> {
  const raw = await fetchText(path);
  // Strip a leading --- frontmatter block if present (metadata already lives in the manifest).
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '');
  return { body };
}
