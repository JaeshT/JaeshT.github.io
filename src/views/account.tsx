// Account screen: sign in with Google, see what sync is doing, sign out.
//
// Everything here degrades quietly. With no Firebase project behind the build the app is exactly
// what it was before, so this screen explains that rather than showing a button that cannot work.

import { useEffect, useState } from 'preact/hooks';
import { navigate } from '../lib/router';
import {
  agoLabel,
  cloudConfigured,
  cloudState,
  signIn,
  signOut,
  subscribeCloud,
  sync,
  type CloudState,
} from '../lib/cloud';
import { BackLink } from './ui';

export function useCloud(): CloudState {
  const [s, setS] = useState<CloudState>(cloudState);
  useEffect(() => subscribeCloud(setS), []);
  return s;
}

/** The four-colour G. Google's terms ask for their mark on the button, not a generic icon. */
function GoogleMark() {
  return (
    <svg class="gmark" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

export function AccountView() {
  const c = useCloud();

  if (!cloudConfigured) {
    return (
      <section>
        <BackLink to="more" label="More" />
        <h1>Account</h1>
        <div class="account-card">
          <p>
            No account service is connected to this build, so everything stays on this device. That
            is the same as it has always been: your progress lives in this browser, and the export
            button is your backup.
          </p>
          <p class="muted small">
            To turn accounts on, follow ACCOUNTS.md in the repo and rebuild with the project keys.
          </p>
          <button class="btn btn-ghost" onClick={() => navigate('progress')}>
            Export a backup instead
          </button>
        </div>
      </section>
    );
  }

  if (c.phase === 'loading') {
    return (
      <section>
        <BackLink to="more" label="More" />
        <h1>Account</h1>
        <p class="muted">Checking…</p>
      </section>
    );
  }

  if (c.phase === 'signed-out') {
    return (
      <section>
        <BackLink to="more" label="More" />
        <h1>Account</h1>
        <div class="account-card">
          <div class="account-head">
            <span class="account-glyph">☁️</span>
            <div>
              <h2 class="account-title">Keep your progress</h2>
              <p class="muted small">Sign in and it follows you to any device.</p>
            </div>
          </div>
          <ul class="account-points">
            <li>Every answer, streak and stage clear is saved to your account.</li>
            <li>Pick up on your phone where you left off on your laptop.</li>
            <li>Clearing your browser stops being a way to lose months of work.</li>
            <li>What you have already done on this device is kept and merged in.</li>
          </ul>
          <button class="btn google" disabled={c.busy} onClick={() => signIn()}>
            <GoogleMark />
            {c.busy ? 'Opening Google…' : 'Sign in with Google'}
          </button>
          {c.error && <div class="banner warn">{c.error}</div>}
          <p class="muted small">
            The app keeps working signed out. Sync is a copy of your study data, nothing else.
          </p>
        </div>
      </section>
    );
  }

  const u = c.user!;
  const status = c.syncing
    ? 'Syncing…'
    : c.pending
      ? 'Changes waiting to sync'
      : `Synced ${agoLabel(c.lastSync)}`;

  return (
    <section>
      <BackLink to="more" label="More" />
      <h1>Account</h1>
      <div class="account-card">
        <div class="account-head">
          <Avatar user={u} size={52} />
          <div>
            <h2 class="account-title">{u.name || 'Signed in'}</h2>
            <p class="muted small">{u.email}</p>
          </div>
        </div>

        <div class={'sync-line' + (c.syncing ? ' busy' : '') + (c.pending && !c.syncing ? ' pending' : '')}>
          <span class="sync-dot" />
          {status}
        </div>
        {c.error && <div class="banner warn">{c.error}</div>}

        <div class="account-actions">
          <button class="btn btn-primary" disabled={c.syncing} onClick={() => sync()}>
            Sync now
          </button>
          <button class="btn btn-ghost" disabled={c.busy} onClick={() => signOut()}>
            Sign out
          </button>
        </div>

        <p class="muted small">
          Signing out leaves this device's copy in place and pushes anything outstanding first.
          Signing in as a different account replaces the copy here with that account's progress.
        </p>
      </div>

      <button class="btn btn-ghost" onClick={() => navigate('progress')}>
        Export a file backup
      </button>
    </section>
  );
}

export function Avatar({ user, size = 32 }: { user: { name: string; photo: string }; size?: number }) {
  const [broken, setBroken] = useState(false);
  if (user.photo && !broken) {
    return (
      <img
        class="account-photo"
        src={user.photo}
        alt=""
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
      />
    );
  }
  return (
    <span class="account-photo initial" style={{ width: size, height: size, fontSize: size * 0.42 }}>
      {(user.name || '?').slice(0, 1).toUpperCase()}
    </span>
  );
}

/** Topbar button: the signed-in photo, or a prompt to sign in. Hidden when there is no project. */
export function AccountButton() {
  const c = useCloud();
  if (!cloudConfigured) return null;
  return (
    <button
      class="account-btn"
      aria-label={c.user ? 'Account' : 'Sign in'}
      title={c.user ? 'Account' : 'Sign in'}
      onClick={() => navigate('account')}
    >
      {c.user ? <Avatar user={c.user} size={28} /> : <span class="account-btn-out">Sign in</span>}
      {c.pending && <span class="account-dot" />}
    </button>
  );
}

/** Home nudge, shown only while signed out and only when there is something to sign in to. */
export function SignInNudge() {
  const c = useCloud();
  if (!cloudConfigured || c.phase !== 'signed-out') return null;
  return (
    <div class="nudge">
      <div>
        <strong>Your progress lives only in this browser.</strong>
        <div class="muted small">Sign in to save it to your account and use it on your phone.</div>
      </div>
      <button class="btn google small" onClick={() => navigate('account')}>
        <GoogleMark />
        Sign in
      </button>
    </div>
  );
}
