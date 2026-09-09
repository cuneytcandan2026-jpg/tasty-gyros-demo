/**
 * The brand's graphic language — all drawn here, all original.
 *
 * Every piece is decorative, so everything is aria-hidden and inherits
 * currentColor. Nothing in here is allowed to carry meaning on its own.
 */
import './Graphics.css';

/* -- Starburst sticker ---------------------------------------------------- */
function burstPoints(spikes, outer, inner) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

/**
 * A sticker badge. `children` is the label — keep it to three or four short
 * words, because it has to sit inside the spikes.
 */
export function Starburst({ children, tone = 'lemon', spikes = 16, className = '', ...rest }) {
  return (
    <span className={`burst burst--${tone} ${className}`.trim()} {...rest}>
      <svg className="burst__shape" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <polygon points={burstPoints(spikes, 50, 41)} />
      </svg>
      <span className="burst__label">{children}</span>
    </span>
  );
}

/**
 * The same spiked shape blown up to hold a block of content rather than a
 * label — used for the review cards. The shape is drawn as an outline on a
 * pale fill, so the text inside stays on a plain ground and keeps its
 * contrast; `tone` only colours the edge and whatever the caller puts inside.
 */
export function BurstCard({ children, tone = 'tomato', spikes = 22, className = '', ...rest }) {
  return (
    <div className={`burstcard burstcard--${tone} ${className}`.trim()} {...rest}>
      <svg
        className="burstcard__shape"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <polygon points={burstPoints(spikes, 49, 44)} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="burstcard__body">{children}</div>
    </div>
  );
}

/* -- Greek key (meander) rule -------------------------------------------- */
/**
 * A meander band. The tile is applied as a CSS mask rather than an inline
 * <svg>, which keeps it tiling correctly at any width and lets it inherit
 * currentColor on whatever ground it lands on.
 */
export function MeanderRule({ height = 24, className = '', ...rest }) {
  return (
    <div
      className={`meander ${className}`.trim()}
      style={{ '--meander-h': `${height}px` }}
      aria-hidden="true"
      {...rest}
    />
  );
}

/* -- Hand-drawn arrows ---------------------------------------------------- */
const ARROWS = {
  /** loops down and to the right — points at something below-right */
  swoop: 'M6 10c22-8 44-2 52 14 5 10-2 21-12 21-8 0-11-8-6-13 7-7 22-6 33 3 6 5 10 11 13 18',
  /** a short nudge to the right */
  nudge: 'M4 26c14-13 33-19 54-19',
  /** curls up and left */
  curl: 'M96 40C80 12 52 4 24 14 14 18 8 26 8 34',
};

export function Arrow({ kind = 'swoop', className = '', ...rest }) {
  const head =
    kind === 'curl' ? 'M4 20l4 15 16-6' : kind === 'nudge' ? 'M46 0l12 7-10 9' : 'M84 52l12 14 3-18';
  return (
    <svg
      className={`doodle doodle--arrow ${className}`.trim()}
      viewBox="0 0 104 70"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={ARROWS[kind]} />
      <path d={head} />
    </svg>
  );
}

/* -- Ingredient doodles --------------------------------------------------- */
const DOODLES = {
  lemon: (
    <>
      <ellipse cx="24" cy="24" rx="19" ry="15" transform="rotate(-20 24 24)" />
      <path d="M13 17c4 4 9 6 14 6M20 33c3-4 8-7 14-8" />
    </>
  ),
  olive: (
    <>
      <ellipse cx="18" cy="27" rx="10" ry="13" />
      <path d="M18 14c1-6 6-9 13-9M28 5c-4 3-6 6-6 9" />
    </>
  ),
  tomato: (
    <>
      <circle cx="24" cy="27" r="14" />
      <path d="M17 13c3 3 5 5 7 5s4-2 7-5M24 13v5" />
    </>
  ),
  pita: (
    <>
      <path d="M6 28c0-9 8-16 18-16s18 7 18 16" />
      <path d="M6 28c0 5 8 8 18 8s18-3 18-8" />
      <path d="M15 24c3-2 6-3 9-3s6 1 9 3" />
    </>
  ),
  chip: (
    <>
      <path d="M14 24V8M21 22V4M28 24V9M34 26V13" />
      <path d="M9 24h30l-3.5 16a2 2 0 0 1-2 2H14.5a2 2 0 0 1-2-2L9 24Z" />
    </>
  ),
  skewer: (
    <>
      <path d="M6 42L42 6" />
      <rect x="14" y="18" width="9" height="9" rx="2" transform="rotate(-45 18.5 22.5)" />
      <rect x="25" y="7" width="9" height="9" rx="2" transform="rotate(-45 29.5 11.5)" />
    </>
  ),
};

export function Doodle({ name, size = 48, className = '', ...rest }) {
  if (!DOODLES[name]) return null;
  return (
    <svg
      className={`doodle ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {DOODLES[name]}
    </svg>
  );
}
