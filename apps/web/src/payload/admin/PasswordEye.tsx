'use client';
import { useEffect, type ReactNode } from 'react';

/*
 * An eye button in every password field of the admin (sign in, first user, reset, change
 * password): click to show what was typed, click again to hide it. Payload's fields have no
 * such option, so this adds the button next to each password input as it appears.
 */
const EYE =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const EYE_OFF =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7c1.8 0 3.4-.5 4.7-1.3"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';

function enhance(input: HTMLInputElement) {
  if (input.dataset.eye) return;
  input.dataset.eye = '1';
  const wrap = input.parentElement;
  if (!wrap) return;
  wrap.style.position = 'relative';
  input.style.paddingRight = '44px';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'bcc-password-eye';
  Object.assign(button.style, {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '32px',
    height: '32px',
    display: 'grid',
    placeItems: 'center',
    padding: '0',
    border: '0',
    borderRadius: '4px',
    background: 'transparent',
    color: 'var(--theme-elevation-500, #666)',
    cursor: 'pointer',
  });
  const update = () => {
    const shown = input.type === 'text';
    button.innerHTML = shown ? EYE_OFF : EYE;
    button.setAttribute('aria-label', shown ? 'Hide password' : 'Show password');
    button.title = shown ? 'Hide password' : 'Show password';
    button.setAttribute('aria-pressed', String(shown));
  };
  button.addEventListener('click', () => {
    input.type = input.type === 'password' ? 'text' : 'password';
    update();
    input.focus();
  });
  update();
  wrap.appendChild(button);
}

export function PasswordEye({ children }: { children?: ReactNode }) {
  useEffect(() => {
    const scan = () =>
      document
        .querySelectorAll<HTMLInputElement>('input[type="password"]:not([data-eye])')
        .forEach(enhance);
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return <>{children}</>;
}
