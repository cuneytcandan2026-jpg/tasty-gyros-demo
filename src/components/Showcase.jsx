import { useCallback, useEffect, useRef, useState } from 'react';
import { showcase, ranges } from '../data/dishes.js';
import { img } from '../lib/images.js';
import { useOrderModal } from './OrderModal.jsx';
import { Starburst, Doodle } from './Graphics.jsx';
import Icon from './Icon.jsx';
import Reveal from './Reveal.jsx';
import './Showcase.css';

const TONES = { lemon: 'lemon', tomato: 'tomato', blue: 'blue' };

function Dish({ dish, index }) {
  const props = img(dish.image, '(max-width: 760px) 82vw, (max-width: 1100px) 44vw, 30vw');
  return (
    <article className="dish" style={{ '--i': index }}>
      {/* The sweep behind each dish is now a clean white, so the shot sits on a
          white plate of its own rather than being multiplied into the ground. */}
      <div className="dish__figure">
        <img {...props} className="dish__img" alt={dish.alt} loading="lazy" decoding="async" />
        <Starburst tone={TONES[dish.tone]} className="dish__burst tilt-a" spikes={18}>
          {dish.burst}
        </Starburst>
      </div>

      <h3 className="dish__name">{dish.name}</h3>
      <p className="dish__shout">{dish.shout}</p>
      <p className="dish__blurb">{dish.blurb}</p>

      <p className="dish__meta">
        {dish.diet && <span className={`tag tag--${dish.diet.toLowerCase()}`}>{dish.diet}</span>}
        <span className="dish__kcal">{dish.kcal}</span>
      </p>
    </article>
  );
}

export default function Showcase() {
  const openOrder = useOrderModal();
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [isCarousel, setIsCarousel] = useState(false);

  // The track only behaves as a carousel at narrow widths; above that it is a
  // plain three-column grid and the controls are removed from the DOM.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const sync = () => setIsCarousel(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Track which slide is centred so the dots stay truthful. No timers here —
  // slides never advance on their own.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || !isCarousel) return undefined;
    // Pick whichever slide is nearest the rail's left edge, measured from the
    // real offsets — guessing from a slide-width fraction drifts once padding
    // and gaps are involved.
    const onScroll = () => {
      const base = el.scrollLeft + el.offsetLeft;
      let best = 0;
      let bestGap = Infinity;
      [...el.children].forEach((slide, i) => {
        const gap = Math.abs(slide.offsetLeft - base);
        if (gap < bestGap) {
          bestGap = gap;
          best = i;
        }
      });
      setActive(best);
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [isCarousel]);

  const goTo = useCallback((i) => {
    const el = trackRef.current;
    if (!el) return;
    const slide = el.children[i];
    if (slide) el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  }, []);

  return (
    <section className="showcase section on-warm" id="menu" aria-labelledby="showcase-title">
      <div className="container">
        <Reveal className="showcase__head">
          <p className="kicker">The short list</p>
          <h2 id="showcase-title" className="showcase__title">
            Meet your
            <br />
            next craving.
          </h2>
          <p className="lede">
            Everything is built to order in the shop: carved, grilled, stuffed with fries
            and wrapped while you wait.
          </p>
        </Reveal>

        <div
          className="showcase__track"
          ref={trackRef}
          {...(isCarousel
            ? { role: 'group', 'aria-roledescription': 'carousel', 'aria-label': 'Menu highlights', tabIndex: 0 }
            : {})}
        >
          {showcase.map((d, i) => (
            <Dish dish={d} index={i} key={d.id} />
          ))}
        </div>

        {isCarousel && (
          <div className="showcase__controls">
            <button
              type="button"
              className="showcase__nav"
              onClick={() => goTo(Math.max(0, active - 1))}
              disabled={active === 0}
              aria-label="Previous dish"
            >
              <Icon name="chevronLeft" size={22} strokeWidth={2.4} />
            </button>

            <ul className="showcase__dots">
              {showcase.map((d, i) => (
                <li key={d.id}>
                  <button
                    type="button"
                    className={`showcase__dot ${i === active ? 'is-active' : ''}`}
                    onClick={() => goTo(i)}
                    aria-label={`Show ${d.name}`}
                    aria-current={i === active ? 'true' : undefined}
                  />
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="showcase__nav"
              onClick={() => goTo(Math.min(showcase.length - 1, active + 1))}
              disabled={active === showcase.length - 1}
              aria-label="Next dish"
            >
              <Icon name="chevronRight" size={22} strokeWidth={2.4} />
            </button>
          </div>
        )}

        <Reveal className="showcase__foot">
          <div className="showcase__ranges">
            <Doodle name="skewer" size={30} />
            <p>
              <span className="showcase__ranges-label">Also on the menu</span>
              {ranges.join(' · ')}
            </p>
          </div>
          <button type="button" className="btn" onClick={openOrder}>
            <Icon name="bag" size={18} />
            See the full menu
          </button>
        </Reveal>
      </div>
    </section>
  );
}
