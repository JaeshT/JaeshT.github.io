// One clock, shared by every format.
//
// It used to live inside the grid, so a timer declared on a board, a bridge or a numeric was
// simply inert: the content said 300 seconds and nothing counted. Declaring fidelity and not
// delivering it is worse than not declaring it, because the tier stops meaning anything.

import { useEffect, useRef, useState } from 'preact/hooks';

export function useClock(limit: number | undefined, onExpire: () => void) {
  const [elapsed, setElapsed] = useState(0);
  const started = useRef(Date.now());
  const fired = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - started.current) / 1000)), 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (limit === undefined || fired.current) return;
    if (elapsed >= limit) {
      fired.current = true;
      onExpire();
    }
  }, [elapsed, limit]);

  return {
    elapsed,
    reset() {
      started.current = Date.now();
      fired.current = false;
      setElapsed(0);
    },
  };
}

export function Clock({ limit, elapsed }: { limit?: number; elapsed: number }) {
  if (limit === undefined) return null;
  const left = Math.max(0, limit - elapsed);
  return (
    <span class={'clock' + (left < 30 ? ' urgent' : '')}>
      {String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}
    </span>
  );
}
