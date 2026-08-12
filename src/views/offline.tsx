import { useEffect, useState } from 'preact/hooks';
import { downloadForOffline } from '../lib/offline';
import { getOfflineStatus, setOfflineStatus, type OfflineStatus } from '../lib/db';

/** One-tap "Download for offline": warms the cache with every content file. */
export function DownloadForOffline() {
  const [status, setStatus] = useState<OfflineStatus | null | undefined>(undefined);
  const [prog, setProg] = useState<{ d: number; t: number } | null>(null);

  useEffect(() => {
    getOfflineStatus().then((s) => setStatus(s ?? null));
  }, []);

  async function run() {
    setProg({ d: 0, t: 1 });
    const n = await downloadForOffline((d, t) => setProg({ d, t }));
    const s = { at: Date.now(), count: n };
    await setOfflineStatus(s);
    setStatus(s);
    setProg(null);
  }

  if (status === undefined) return null; // still loading status
  const pct = prog ? Math.round((prog.d / prog.t) * 100) : 0;

  return (
    <div class="offline-box">
      <div class="offline-head">
        <strong>⬇️ Download for offline</strong>
        {status && !prog && <span class="pill ok">ready ✓</span>}
      </div>
      {!status && !prog && (
        <p class="muted small">
          Save the whole app + all content to this device so it works with no signal. Do this once on WiFi.
          Re-tap if it ever stops working offline. iOS clears caches after about a week unused.
        </p>
      )}
      {prog ? (
        <div class="dl-prog">
          <div class="bar">
            <div class="bar-fill" style={{ width: pct + '%' }} />
          </div>
          <span class="muted small">
            {prog.d}/{prog.t}
          </span>
        </div>
      ) : (
        <button class="btn btn-primary" onClick={run}>
          {status ? 'Update offline copy' : 'Download for offline'}
        </button>
      )}
      {status && !prog && (
        <div class="muted small">
          Saved {new Date(status.at).toLocaleDateString()} · {status.count} files cached
        </div>
      )}
    </div>
  );
}
