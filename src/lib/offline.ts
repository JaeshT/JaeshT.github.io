// "Download for offline" — warms the service-worker cache with every content file so the
// app works with no network even after iOS evicts caches (just re-tap to re-arm).

import { loadIndex } from './content';
import type { ContentIndex } from './schema';

const BASE = '/content/';

export function allContentPaths(index: ContentIndex): string[] {
  const p = new Set<string>(['index.json']);
  index.lessons.forEach((l) => p.add(l.path));
  index.flashcardDecks.forEach((d) => p.add(d.path));
  index.questionSets.forEach((q) => p.add(q.path));
  index.quizzes.forEach((q) => p.add(q.path));
  index.glossary?.paths.forEach((g) => p.add(g));
  index.briefings?.forEach((b) => p.add(b.path));
  index.excel?.forEach((e) => e.walkthrough && p.add(e.walkthrough));
  return [...p];
}

/** Fetch every content file (through the service worker) so it's cached for offline use. */
export async function downloadForOffline(onProgress: (done: number, total: number) => void): Promise<number> {
  const index = await loadIndex();
  const paths = allContentPaths(index);
  let done = 0;
  for (const path of paths) {
    try {
      await fetch(BASE + path);
    } catch {
      /* ignore individual failures; keep warming the rest */
    }
    done += 1;
    onProgress(done, paths.length);
  }
  return paths.length;
}
