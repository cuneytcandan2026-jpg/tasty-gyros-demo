/**
 * Inline stroke icons — no icon font, no emoji.
 * All use currentColor so they inherit text colour.
 */
const P = {
  fresh: (
    <>
      <path d="M12 21c5-1 8-5 8-11V5l-4 1C9 7 5 10 5 16c0 2 1 4 2 5" />
      <path d="M7 21c0-6 3-10 9-12" />
    </>
  ),
  flame: (
    <>
      <path d="M12 3c1 3-1 5-2.5 7C8 12 7 13.5 7 15.5A5 5 0 0 0 17 16c0-2-1-3.5-2-5-.8-1.2-1.6-2.4-1.5-4" />
      <path d="M12 20a2.5 2.5 0 0 1-2.5-2.6c0-1.2.9-2 1.5-3 .7 1.2 2 1.8 2 3.2A2.4 2.4 0 0 1 12 20Z" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 20v-7" />
      <path d="M12 13c0-3-2-5-6-5 0 4 2 6 6 6Z" />
      <path d="M12 11c0-3 2-4 5-4 0 3-2 5-5 5Z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.3 7-11a7 7 0 0 0-14 0c0 4.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  external: (
    <>
      <path d="M14 5h5v5" />
      <path d="M19 5l-8 8" />
      <path d="M19 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
    </>
  ),
  phone: (
    <path d="M6.5 4h3l1.5 4-2 1.5a12 12 0 0 0 5 5L15.5 16l4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3 6.6 1.5 1.5 0 0 1 4.5 5h2Z" />
  ),
  directions: (
    <>
      <path d="m11 2 11 11-11 11L0 13 11 2Z" opacity="0" />
      <path d="M12 2.5 21.5 12 12 21.5 2.5 12 12 2.5Z" />
      <path d="M9 14v-2.5A2.5 2.5 0 0 1 11.5 9H15" />
      <path d="m13 7 2.5 2L13 11" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  bag: (
    <>
      <path d="M6 8h12l1 12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  play: <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" stroke="none" />,
  pause: (
    <>
      <rect x="7" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none" />
      <rect x="13.4" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  chevronRight: <path d="M9 5l7 7-7 7" />,
  facebook: (
    <path d="M15.5 8.5H14c-.9 0-1.5.6-1.5 1.5v2h3l-.5 3h-2.5v6h-3v-6H7v-3h2.5v-2.3A4.2 4.2 0 0 1 13.8 5.5h1.7v3Z" />
  ),
  tiktok: (
    <>
      <path d="M14 3.5v11.7a3.6 3.6 0 1 1-3-3.55" />
      <path d="M14 3.5c.5 2.7 2.2 4.4 5 4.7" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),

  /* --- Solid marks: these read as symbols, not as line drawings ---------- */
  star: (
    <path
      d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.11 6.47L12 17.47 6.19 20.5 7.3 14.05l-4.7-4.6 6.5-.95L12 2.6Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  quote: (
    <path
      d="M9.4 5.5c-3 1.4-4.9 4-4.9 7.3V18.5h6.4v-6.1H7.6c0-2 .8-3.3 2.6-4.3l-.8-2.6Zm9 0c-3 1.4-4.9 4-4.9 7.3V18.5H20v-6.1h-3.4c0-2 .8-3.3 2.6-4.3l-.8-2.6Z"
      fill="currentColor"
      stroke="none"
    />
  ),

  /* --- Feed-card affordances -------------------------------------------- */
  heart: (
    <path d="M12 20s-7.2-4.4-7.2-9.2A4 4 0 0 1 12 8.2a4 4 0 0 1 7.2 2.6C19.2 15.6 12 20 12 20Z" />
  ),
  bubble: <path d="M20.5 11.6c0 4-3.8 7.2-8.5 7.2a10 10 0 0 1-2.6-.34L4.2 20l1.3-3.6a6.8 6.8 0 0 1-2-4.8c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.2Z" />,
  send: (
    <>
      <path d="M21 4 3.5 10.4l7 2.2 2.2 7L21 4Z" />
      <path d="m10.5 12.6 4.4-4.4" />
    </>
  ),
  bookmark: <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4.2L6 20V5a1 1 0 0 1 1-1Z" />,
  dots: (
    <>
      <circle cx="6" cy="12" r="1.35" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.35" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.35" fill="currentColor" stroke="none" />
    </>
  ),
  chevronDown: <path d="M6 9.5 12 15.5 18 9.5" />,
};

export default function Icon({ name, size = 24, className = '', strokeWidth = 1.6, ...rest }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {P[name] || null}
    </svg>
  );
}
