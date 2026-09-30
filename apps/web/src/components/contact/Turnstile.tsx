'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey: string; callback: (t: string) => void; 'expired-callback': () => void },
      ) => string;
      remove: (id: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/**
 * Cloudflare Turnstile bot check. Rendered only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set;
 * without it the form relies on the honeypot, timing and rate limits.
 */
export function Turnstile({ onToken }: { onToken: (token: string | undefined) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return;
    const el = ref.current;
    let id: string | undefined;
    const mount = () => {
      if (!window.turnstile || id) return;
      id = window.turnstile.render(el, {
        sitekey: SITE_KEY,
        callback: (token) => onToken(token),
        'expired-callback': () => onToken(undefined),
      });
    };
    if (window.turnstile) mount();
    else {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`);
      const script =
        existing ?? Object.assign(document.createElement('script'), { src: SCRIPT, async: true });
      script.addEventListener('load', mount);
      if (!existing) document.head.appendChild(script);
    }
    return () => {
      if (id) window.turnstile?.remove(id);
    };
  }, [onToken]);

  return SITE_KEY ? <div ref={ref} style={{ minHeight: 65 }} /> : null;
}
