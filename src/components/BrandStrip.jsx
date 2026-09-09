import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import './BrandStrip.css';

/* The name leads the loop and is the only coloured word in it, so each pass
   reads as the brand followed by what it makes — not as four ingredients. */
const WORDS = [
  { text: 'Tasty Gyros', brand: true },
  { text: 'Golden fries' },
  { text: 'Tzatziki' },
  { text: 'Greek street food' },
];

/** One pass of the phrase. Only the first pass is exposed to screen readers. */
function Run({ hidden }) {
  return (
    <span className="strip__run" aria-hidden={hidden || undefined}>
      {WORDS.map((w) => (
        <span className={`strip__word ${w.brand ? 'is-brand' : ''}`.trim()} key={w.text}>
          {w.text}
          <span className="strip__dot" aria-hidden="true">
            •
          </span>
        </span>
      ))}
    </span>
  );
}

export default function BrandStrip() {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  // If the visitor prefers reduced motion the strip never scrolls, so the
  // pause control would be meaningless — it is not rendered at all.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <div className={`strip ${paused ? 'is-paused' : ''}`}>
      <div className="strip__track">
        <Run />
        <Run hidden />
        <Run hidden />
      </div>

      {!reduced && (
        <button
          type="button"
          className="strip__toggle"
          onClick={() => setPaused((v) => !v)}
          aria-pressed={paused}
        >
          <Icon name={paused ? 'play' : 'pause'} size={16} />
          <span className="vh">{paused ? 'Resume' : 'Pause'} the scrolling banner</span>
        </button>
      )}
    </div>
  );
}
