import { img } from '../lib/images.js';
import { Doodle } from './Graphics.jsx';
import Reveal from './Reveal.jsx';
import './Story.css';

/**
 * Everything stated here comes from Tasty Gyros' own About page: the 2021
 * start, the two kitchens, and their description of how a gyros is made.
 * No invented family history, awards or sourcing claims.
 */
const FACTS = [
  { doodle: 'skewer', label: 'Serving London since 2021' },
  { doodle: 'pita', label: 'Two kitchens, one menu' },
  { doodle: 'olive', label: 'Vegan & vegetarian wraps' },
];

export default function Story() {
  const props = img('story-team', '(max-width: 900px) 82vw, 40vw');

  return (
    <section className="story section on-cream" id="story" aria-labelledby="story-title">
      <div className="story__grid container">
        <Reveal className="story__copy">
          <p className="kicker">Our story</p>
          <h2 id="story-title" className="story__title">
            Sliced fresh,
            <br />
            never sat waiting.
          </h2>

          <p className="lede">
            A gyros is seasoned meat slow-cooked on a vertical rotisserie and carved to
            order, served warm in soft pita with tomato, onion, crispy fries and tzatziki.
          </p>
          <p className="story__body">
            That is the whole idea, and it is what Tasty Gyros has been doing in London since
            2021.
            Two kitchens, one menu, and every wrap built when you ask for it.
          </p>

          <ul className="story__facts">
            {FACTS.map((f) => (
              <li key={f.label}>
                <Doodle name={f.doodle} size={30} />
                {f.label}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="story__media" delay={110}>
          <div className="story__frame">
            <img
              {...props}
              className="story__img"
              alt="A Tasty Gyros team member in a yellow branded visor holding out a freshly wrapped gyros."
              loading="lazy"
              decoding="async"
            />
          </div>
          <span className="story__tape tilt-a">Made when you order it</span>
        </Reveal>
      </div>
    </section>
  );
}
