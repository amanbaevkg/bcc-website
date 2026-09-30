import type { ServiceIcon as Name } from '@/content/types';

/** Line icons for the services list, drawn on a 32 px grid with the site's 1.5 px stroke. */
const icons: Record<Name, string[]> = {
  wifi: [
    'M4 12.5a17 17 0 0 1 24 0',
    'M8.5 17a11 11 0 0 1 15 0',
    'M13 21.5a4.8 4.8 0 0 1 6 0',
    'M16 26h.01',
  ],
  reception: ['M5 24h22', 'M7 24a9 9 0 0 1 18 0', 'M16 15v-3', 'M13.5 12h5', 'M4 27h24'],
  meeting: [
    'M7 20h18v3H7z',
    'M9 23v4M23 23v4',
    'M11 13.5a2.5 2.5 0 1 0 0-.01',
    'M21 13.5a2.5 2.5 0 1 0 0-.01',
    'M16 11a2.5 2.5 0 1 0 0-.01',
  ],
  kitchen: [
    'M7 12h15v7a6 6 0 0 1-6 6h-3a6 6 0 0 1-6-6z',
    'M22 14h2.5a2.5 2.5 0 0 1 0 5H22',
    'M11 5v3M15 5v3M19 5v3',
    'M5 28h19',
  ],
  supplies: ['M20.5 5.5l6 6L12 26H6v-6z', 'M17.5 8.5l6 6', 'M6 20l6 6'],
  parking: ['M6 5h20v22H6z', 'M13 22V10h4.5a3.5 3.5 0 0 1 0 7H13'],
  cloud: [
    'M9.5 23a5.5 5.5 0 0 1-.8-10.9A7.5 7.5 0 0 1 23 12a5.5 5.5 0 0 1 .5 11z',
    'M16 23v5M11 28h10',
  ],
  mail: ['M5 8h22v16H5z', 'M5 9l11 8 11-8'],
  handshake: [
    'M3 13l5-5 5 3 4-3 4 2 5-2 3 5',
    'M8 8l-5 5 9 9a2 2 0 0 0 3 0l8-8',
    'M12 19l3 3M15 16l3 3M18 13l3 3',
  ],
  more: ['M9 16h.01M16 16h.01M23 16h.01', 'M4 16a12 12 0 1 0 24 0a12 12 0 1 0-24 0'],
};

export function ServiceIcon({ name, size = 32 }: { name: Name; size?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {icons[name].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
