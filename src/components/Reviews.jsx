import { reviews } from '../data/reviews.js';
import { BurstCard } from './Graphics.jsx';
import Icon from './Icon.jsx';
import Reveal from './Reveal.jsx';
import './Reviews.css';

/**
 * A slow, continuously travelling rail of review stickers.
 *
 * The list is rendered twice and the track is translated by exactly half its
 * width, so the loop is seamless without any JS driving it. The duplicate is
 * aria-hidden, which keeps a screen reader from reading every quote twice; the
 * rail is also a plain scroll container, so it can still be dragged, and
 * reduced-motion visitors get that instead of the animation.
 */
function Stars({ rating }) {
  return (
    <span className="rev__stars">
      {Array.from({ length: rating }, (_, i) => (
        <Icon key={i} name="star" size={13} />
      ))}
      <span className="vh">{rating} out of 5</span>
    </span>
  );
}

function ReviewCard({ review }) {
  return (
    <li className="rev__item">
      <BurstCard tone={review.tone} spikes={24} className="rev__card">
        <Icon name="quote" size={20} className="rev__mark" />
        <Stars rating={review.rating} />
        <p className="rev__quote">&ldquo;{review.quote}&rdquo;</p>
        <p className="rev__by">{review.author}</p>
      </BurstCard>
    </li>
  );
}

export default function Reviews() {
  return (
    <section className="rev section on-cream" aria-labelledby="rev-title">
      <div className="container">
        <Reveal className="rev__head">
          <h2 id="rev-title" className="rev__title">
            Real talk, real gyros.
          </h2>
          <p className="rev__sub">What a London lunch break sounds like</p>
        </Reveal>
      </div>

      <div className="rev__rail">
        <div className="rev__track">
          <ul className="rev__row">
            {reviews.map((r) => (
              <ReviewCard review={r} key={r.id} />
            ))}
          </ul>
          <ul className="rev__row" aria-hidden="true">
            {reviews.map((r) => (
              <ReviewCard review={r} key={`${r.id}-echo`} />
            ))}
          </ul>
        </div>
      </div>

      <div className="container">
        <p className="rev__note">
          Placeholder copy for this concept — the quotes, names and ratings above are written,
          not collected. A live build would pull verified reviews in their place.
        </p>
      </div>
    </section>
  );
}
