'use client';
import { useLocale } from '@payloadcms/ui';

/**
 * Help text under a per-language field. While editing FR, DE or LU it adds that an empty
 * field shows the English text, so the English form stays short.
 */
export function Hint({ text }: { text?: string }) {
  const locale = useLocale();
  const other = locale?.code && locale.code !== 'en';
  const parts = [text, other && 'Leave empty to show the English text.'].filter(Boolean);
  if (!parts.length) return null;
  return <div className="field-description">{parts.join(' ')}</div>;
}
