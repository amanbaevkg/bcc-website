'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const SELECTOR = 'h1, h2, h3, .xl';

/**
 * Words are never split across lines (globals.css), so a long word, often German or
 * Luxembourgish, could stick out of a large heading on a narrow screen. Each heading that is
 * wider than its column is made just small enough for its longest word to fit; the design's
 * size stays everywhere it already fits.
 */
export function fitHeading(el: HTMLElement) {
  // A browser may still break a word at its hyphen ("Coworking-Büros"): an invisible word
  // joiner after each hyphen keeps the two halves together.
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.nodeValue ?? '';
    if (/[-\u2010](?!\u2060)/.test(text))
      node.nodeValue = text.replace(/([-\u2010])(?!\u2060)/g, '$1\u2060');
  }
  el.style.fontSize = '';
  if (getComputedStyle(el).display === 'inline') return;
  for (let i = 0; i < 6; i++) {
    // Where the text ends against the room it has: its own box, and never past the screen's
    // edge (keeping the page's 16 px phone margin there too); a long word can also widen the
    // column around the heading.
    const box = el.getBoundingClientRect();
    const screen = document.documentElement.clientWidth - Math.min(Math.max(box.left, 0), 16);
    // A heading that starts off screen (in a sideways-scrolling row) is measured by its box only.
    const limit = box.left < screen - 40 ? Math.min(box.right, screen) : box.right;
    const text = document.createRange();
    text.selectNodeContents(el);
    const end = Math.max(...[...text.getClientRects()].map((r) => r.right), box.left);
    if (end <= limit + 1) break;
    const size = parseFloat(getComputedStyle(el).fontSize);
    const ratio = (limit - box.left) / (end - box.left);
    if (!(ratio > 0)) break;
    el.style.fontSize = `${Math.floor(size * ratio * 0.98 * 10) / 10}px`;
  }
}

function fitAll() {
  document.querySelectorAll<HTMLElement>(SELECTOR).forEach(fitHeading);
}

export function FitHeadings() {
  const pathname = usePathname();

  useEffect(() => {
    fitAll();
    // Again once the web font is in (it is wider than the fallback) and whenever the width changes.
    void document.fonts?.ready.then(fitAll);
    let width = window.innerWidth;
    let frame = 0;
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fitAll);
    };
    window.addEventListener('resize', onResize);
    // Headings shown or changed later, such as the contact form's thank-you message.
    const added = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fitAll);
    });
    added.observe(document.body, { childList: true, characterData: true, subtree: true });
    return () => {
      window.removeEventListener('resize', onResize);
      added.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
