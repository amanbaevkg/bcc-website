import { notFound } from 'next/navigation';

// Any unknown path inside a locale renders app/[locale]/not-found.tsx with the site chrome.
export default function CatchAll() {
  notFound();
}
