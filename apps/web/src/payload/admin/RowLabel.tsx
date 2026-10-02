'use client';
import { useRowLabel } from '@payloadcms/ui';

/** Names a list row after one of its fields ("Kitchen", "ACME SA") instead of "Item 03". */
export function RowLabel({ field, fallback = 'Item' }: { field: string; fallback?: string }) {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>();
  const value = data?.[field];
  const label = typeof value === 'string' && value.trim() ? value.trim() : '';
  const n = String((rowNumber ?? 0) + 1).padStart(2, '0');
  return <span>{label ? `${n}. ${label.slice(0, 60)}` : `${fallback} ${n}`}</span>;
}
