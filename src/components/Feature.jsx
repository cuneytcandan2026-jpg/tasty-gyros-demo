import { feature } from '../data/dishes.js';
import { img } from '../lib/images.js';
import { useOrderModal } from './OrderModal.jsx';
import { Starburst, Arrow, MeanderRule } from './Graphics.jsx';
import Icon from './Icon.jsx';
import Reveal from './Reveal.jsx';
import './Feature.css';

export default function Feature() {
  const openOrder = useOrderModal();
  const props = img(feature.image, '(max-width: 900px) 88vw, 46vw');

  return (
    <section className="feature on-deep" aria-labelledby="feature-title">
      <MeanderRule height={20} className="feature__key" />

      <div className="feature__grid container section">
        <Reveal className="feature__media">
          <div className="feature__panel">
            <img
              {...props}
              className="feature__img food-float"
              alt={feature.alt}
              loading="lazy"
              decoding="async"
            />
          </div>
          <Starburst tone="tomato" className="feature__burst tilt-b" spikes={20}>
            Box it up
          </Starburst>
        </Reveal>

        <Reveal className="feature__copy" delay={90}>
          <p className="kicker">Not in the mood to roll it up?</p>
          <h2 id="feature-title" className="feature__title">
            Everything,
            <br />
            <span className="feature__accent">laid out.</span>
          </h2>
          <p className="lede">{feature.blurb}</p>

          <p className="feature__kcal">
            {feature.name} · {feature.kcal}
          </p>

          <span className="feature__cta">
            <button type="button" className="btn btn--lemon" onClick={openOrder}>
              <Icon name="bag" size={18} />
              Order a box
            </button>
            <Arrow kind="curl" className="feature__arrow" />
          </span>
        </Reveal>
      </div>
    </section>
  );
}
