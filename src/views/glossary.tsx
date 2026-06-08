import { useEffect, useMemo, useState } from 'preact/hooks';
import { loadIndex, loadGlossary } from '../lib/content';
import type { GlossaryTerm } from '../lib/schema';
import { Loading, Empty } from './learn';

export function Glossary() {
  const [terms, setTerms] = useState<GlossaryTerm[] | null>(null);
  const [error, setError] = useState(false);
  const [q, setQ] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const index = await loadIndex();
        if (!index.glossary) {
          if (alive) setTerms([]);
          return;
        }
        const g = await loadGlossary(index.glossary.path);
        if (alive) setTerms(g.terms.sort((a, b) => a.term.localeCompare(b.term)));
      } catch {
        if (alive) setError(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!terms) return [];
    const s = q.trim().toLowerCase();
    if (!s) return terms;
    return terms.filter(
      (t) => t.term.toLowerCase().includes(s) || t.definition.toLowerCase().includes(s),
    );
  }, [terms, q]);

  if (error) return <Empty title="Glossary" note="Couldn't load the glossary." back="more" />;
  if (!terms) return <Loading />;
  if (terms.length === 0)
    return <Empty title="Glossary" note="The glossary fills in as each domain is built." back="more" />;

  return (
    <section>
      <h1>Glossary</h1>
      <input
        class="search"
        placeholder={`Search ${terms.length} terms…`}
        value={q}
        onInput={(e) => setQ((e.target as HTMLInputElement).value)}
      />
      <dl class="glossary">
        {filtered.map((t) => (
          <div key={t.term} class="gterm">
            <dt>{t.term}</dt>
            <dd>{t.definition}</dd>
          </div>
        ))}
      </dl>
      {filtered.length === 0 && <p class="muted">No matches.</p>}
    </section>
  );
}
