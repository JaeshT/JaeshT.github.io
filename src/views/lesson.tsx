// A primer: markdown (with math) for the concepts behind a module, read before you drill it.

import { useEffect, useState } from 'preact/hooks';
import { loadIndex, loadLesson } from '../lib/content';
import { renderMarkdown } from '../lib/md';
import { getProgress, recordStudy, updateProgress } from '../lib/db';
import { BackLink, Loading, LoadError } from './ui';

export function Lesson({ id }: { id: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);
  const [back, setBack] = useState('path');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const index = await loadIndex();
        let path: string | undefined;
        for (const m of index.modules) {
          const ref = m.lessons?.find((l) => l.id === id);
          if (ref) {
            path = ref.path;
            if (alive) setBack(`module/${m.id}`);
            break;
          }
        }
        if (!path) throw new Error('not found');
        const { body } = await loadLesson(path);
        const p = await getProgress();
        if (!alive) return;
        setHtml(renderMarkdown(body));
        setDone(p.lessonsRead.includes(id));
      } catch {
        if (alive) setError(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  async function markDone() {
    await updateProgress((p) => ({
      ...p,
      lessonsRead: p.lessonsRead.includes(id) ? p.lessonsRead : [...p.lessonsRead, id],
    }));
    await recordStudy(10);
    setDone(true);
  }

  if (error) return <LoadError title="Primer" back="path" />;
  if (html === null) return <Loading />;

  return (
    <section>
      <BackLink to={back} label="Back" />
      <article class="prose" dangerouslySetInnerHTML={{ __html: html }} />
      <div class="lesson-foot">
        <button class={'btn' + (done ? ' btn-ghost' : ' btn-primary')} onClick={markDone}>
          {done ? '✓ Read' : 'Mark as read (+10 XP)'}
        </button>
      </div>
    </section>
  );
}
