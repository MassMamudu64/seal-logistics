'use client';
import { useEffect, useState } from 'react';
import { Button } from '@seal/ui';

const STORAGE_KEY = 'seal.consent.v1';

type Choice = 'accepted' | 'rejected';

/**
 * GDPR/EPR-style cookie banner. Two choices: accept all, or reject all.
 * - No analytics fires until the user accepts.
 * - We update Google Consent Mode v2 via gtag('consent', 'update', ...).
 * - Choice persists in localStorage; banner hides for 6 months.
 */
export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setOpen(true);
  }, []);

  function set(choice: Choice) {
    const payload = JSON.stringify({ choice, at: Date.now() });
    localStorage.setItem(STORAGE_KEY, payload);
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: choice === 'accepted' ? 'granted' : 'denied',
        analytics_storage: choice === 'accepted' ? 'granted' : 'denied',
      });
    }
    setOpen(false);
  }

  if (!open) return null;
  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-xl border border-neutral-200 bg-white p-4 shadow-2xl"
    >
      <p className="text-sm text-neutral-700">
        We use cookies for analytics so we can improve the site. No advertising cookies. Read the{' '}
        <a href="/legal/privacy" className="underline">
          privacy notice
        </a>
        .
      </p>
      <div className="mt-3 flex gap-2">
        <Button intent="primary" size="sm" onClick={() => set('accepted')}>
          Accept
        </Button>
        <Button intent="ghost" size="sm" onClick={() => set('rejected')}>
          Reject
        </Button>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
