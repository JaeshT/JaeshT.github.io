// Loads the content manifest and individual content files at runtime via fetch.
// Files are precached by the service worker, so this works fully offline after first load.

import type { ContentIndex, Glossary, QuestionBank } from './schema';

const BASE = '/content/';

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

async function fetchText(path: string): Promise<string> {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.text();
}

let indexCache: ContentIndex | null = null;
const bankCache = new Map<string, QuestionBank>();

export async function loadIndex(): Promise<ContentIndex> {
  if (!indexCache) indexCache = await fetchJson<ContentIndex>('index.json');
  return indexCache;
}

export async function loadBank(path: string): Promise<QuestionBank> {
  const hit = bankCache.get(path);
  if (hit) return hit;
  const bank = await fetchJson<QuestionBank>(path);
  bankCache.set(path, bank);
  return bank;
}

/** Every built module's bank, keyed by module id. Modules without a bank are skipped. */
export async function loadAllBanks(index: ContentIndex): Promise<Record<string, QuestionBank>> {
  const built = index.modules.filter((m) => m.bank);
  const banks = await Promise.all(built.map((m) => loadBank(m.bank!)));
  const out: Record<string, QuestionBank> = {};
  built.forEach((m, i) => (out[m.id] = banks[i]));
  return out;
}

export const loadGlossary = (path: string) => fetchJson<Glossary>(path);

/** Load and merge multiple glossary files, de-duplicating by term (case-insensitive). */
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

/** Lessons are markdown with optional YAML-ish frontmatter; return {body}. */
export async function loadLesson(path: string): Promise<{ body: string }> {
  const raw = await fetchText(path);
  // Strip a leading --- frontmatter block if present (metadata already lives in the manifest).
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '');
  return { body };
}
