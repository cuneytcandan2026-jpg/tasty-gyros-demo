import mark from '../assets/logo-spit-trimmed.png';
import './Logo.css';

/**
 * Tasty Gyros lockup — the brand's own yellow gyros-spit mark in a chip that
 * keeps it legible on any ground, plus a wordmark in the display face.
 *
 * `variant="emblem"` is the header's hanging pendant instead: the mark and a
 * compressed wordmark stacked in one badge, sized to overhang the bar. The
 * yellow spit is invisible on cream, so the badge is what carries it — the
 * deep ground and the ink edge are structural, not decoration.
 */
export default function Logo({ tone = 'ink', variant = 'lockup', withText = true, className = '' }) {
  if (variant === 'emblem') {
    return (
      <span className={`logo logo--emblem ${className}`.trim()}>
        <span className="logo__pendant">
          <img src={mark} alt="" width="24" height="36" />
          <span className="logo__stack">
            Tasty
            <br />
            Gyros
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className={`logo logo--${tone} ${className}`.trim()}>
      <span className="logo__chip">
        <img src={mark} alt="" width="22" height="33" />
      </span>
      {withText && (
        <span className="logo__word">
          <span className="logo__name">Tasty Gyros</span>
          <span className="logo__sub">Greek street food · London</span>
        </span>
      )}
    </span>
  );
}
