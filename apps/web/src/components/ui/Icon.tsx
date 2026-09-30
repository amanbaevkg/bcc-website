import type { SVGProps } from 'react';

const paths = {
  arrow: 'M5 12h13M13 6l6 6-6 6',
  arrowLeft: 'M21 12H4M10 6l-6 6 6 6',
  arrowUpRight: 'M6 18L18 6M8.5 6H18v9.5',
  chevron: 'M6 9l6 6 6-6',
  menu: 'M4 8h16M4 16h16',
  close: 'M6 6l12 12M18 6L6 18',
} as const;

export type IconName = keyof typeof paths;

/** Stroke icons. Decorative by default; give the parent control an accessible name. */
export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}

const social = {
  linkedin:
    'M4.98 3.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.95 1.32-1.95 2.7V21h-4z',
  facebook:
    'M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.6V4.46A21 21 0 0014.3 4.3c-2.3 0-3.8 1.4-3.8 3.95V10.5H8v3h2.5V21z',
} as const;

export function SocialIcon({ network }: { network: keyof typeof social }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path fill="currentColor" d={social[network]} />
    </svg>
  );
}

export function Star() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"
      />
    </svg>
  );
}
