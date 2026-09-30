import type { TextRun } from '@/content/types';

/** Short CMS paragraphs: plain text with bold runs. Rendered as elements, never as HTML. */
export function RichText({ runs }: { runs: TextRun[] }) {
  return (
    <>{runs.map((r, i) => (typeof r === 'string' ? r : <strong key={i}>{r.strong}</strong>))}</>
  );
}
