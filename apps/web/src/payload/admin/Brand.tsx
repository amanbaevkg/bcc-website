/*
 * BCC's mark in the admin instead of Payload's: the two buildings from the site's icon,
 * drawn in the text colour so they show in the light and the dark admin theme.
 */
const Buildings = ({ size }: { size: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    fillRule="evenodd"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M2 9h7v13H2zM3.5 11v2h1.5v-2zm2.5 0v2h1.5v-2zM3.5 14.5v2h1.5v-2zm2.5 0v2h1.5v-2z" />
    <path d="M10.5 2H19v20h-8.5zM12 4v2h1.8V4zm3 0v2h1.8V4zM12 7.5v2h1.8v-2zm3 0v2h1.8v-2zM12 11v2h1.8v-2zm3 0v2h1.8v-2zM12 14.5v2h1.8v-2zm3 0v2h1.8v-2z" />
  </svg>
);

/** Top left of every admin page. */
export function Icon() {
  return <Buildings size={26} />;
}

/** Sign-in page. */
export function Logo() {
  return (
    <span
      role="img"
      aria-label="BCC – Business Center Capellen"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}
    >
      <Buildings size={64} />
      <span style={{ font: '600 44px/1 system-ui, sans-serif', color: '#00bfff' }}>BCC</span>
    </span>
  );
}
