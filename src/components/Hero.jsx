import Icon from './Icon.jsx';
import { img } from '../lib/images.js';
import { useOrderModal } from './OrderModal.jsx';
import { Starburst, Arrow, Doodle, MeanderRule } from './Graphics.jsx';
import './Hero.css';

export default function Hero() {
  const openOrder = useOrderModal();
  const hero = img('hero-gyros', '(max-width: 900px) 78vw, 40vw');

  return (
    <section className="hero on-blue" aria-labelledby="hero-title">
      <div className="hero__wash" aria-hidden="true" />

      <div className="hero__grid container">
        <div className="hero__copy">
          <p className="kicker hero__kicker">Enfield Town · Notting Hill Gate</p>

          <h1 id="hero-title" className="hero__title">
            <span className="hero__line">Big</span>
            <span className="hero__line">Greek</span>
            <span className="hero__line hero__line--accent">Energy.</span>
          </h1>

          <p className="lede hero__lede">
            Gyros, golden fries and proper Greek flavour. Find us in Enfield Town and
            Notting Hill Gate.
          </p>

          <div className="hero__actions">
            <span className="hero__cta-wrap">
              <button type="button" className="btn btn--lemon" onClick={openOrder}>
                <Icon name="bag" size={18} />
                Order now
              </button>
              <Arrow kind="nudge" className="hero__arrow" aria-hidden="true" />
            </span>
            <a href="#menu" className="btn btn--ghost">
              Explore the menu
            </a>
          </div>

          <ul className="hero__facts">
            <li>
              <Doodle name="pita" size={26} /> Fries go inside the pita
            </li>
            <li>
              <Doodle name="lemon" size={26} /> Vegan &amp; vegetarian wraps
            </li>
          </ul>
        </div>

        <div className="hero__media">
          <div className="hero__arch">
            <img
              className="hero__img"
              {...hero}
              alt="A Tasty Gyros chicken gyros wrap in warm Greek pita, loaded with golden fries, lettuce and tomato."
              fetchpriority="high"
              decoding="async"
            />
          </div>

          <Starburst tone="lemon" className="hero__burst tilt-a">
            Fries in the pita
          </Starburst>

          <span className="hero__chip tilt-b">Two London kitchens</span>
        </div>
      </div>

      <MeanderRule height={22} className="hero__key" />
    </section>
  );
}
