import mark from '../assets/logo-spit-trimmed.png';
import { img } from '../lib/images.js';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from '../data/locations.js';
import Icon from './Icon.jsx';
import Reveal from './Reveal.jsx';
import './Gallery.css';

/**
 * The feed section, styled as Instagram post cards.
 *
 * Two things are worth being straight about. The photography is Tasty Gyros'
 * own, bundled with the page — this is not a live embed, so no tile can ever
 * come up empty or show someone else's content. And the engagement figures are
 * placeholders that make the card read as a post; they are not counts of
 * anything. A production build would swap both for the Instagram Basic Display
 * / Graph API, at which point the numbers become real or come off entirely.
 */
const POSTS = [
  {
    key: 'gal-team',
    alt: 'A Tasty Gyros team member in a branded yellow visor holding a freshly wrapped gyros.',
    likes: 214,
    comments: 18,
    shares: 26,
  },
  {
    key: 'gal-gyros-box',
    alt: 'Chicken gyros box with carved chicken, golden fries, Greek salad and a pot of tzatziki.',
    likes: 187,
    comments: 12,
    shares: 31,
  },
  {
    key: 'gal-mixed-wrap',
    alt: 'Mixed meat gyros wrap in Greek pita with fries and salad.',
    likes: 163,
    comments: 9,
    shares: 14,
  },
  {
    key: 'show-gyros-bowl',
    alt: 'Gyros bowl with grilled souvlaki, peppers, red onion, tomato and a pot of dressing.',
    likes: 142,
    comments: 11,
    shares: 19,
  },
  {
    key: 'gal-greek-salad',
    alt: 'Greek salad with feta, olives, cucumber and tomato in a takeaway tub.',
    likes: 128,
    comments: 7,
    shares: 12,
  },
  {
    key: 'gal-lamb-wrap',
    alt: 'Lamb skewer wrap in Greek pita with fries, tomato and onion.',
    likes: 176,
    comments: 15,
    shares: 22,
  },
];

function Post({ post }) {
  const props = img(post.key, '(max-width: 640px) 92vw, (max-width: 1000px) 46vw, 31vw');
  return (
    <li className="post">
      <article className="post__card">
        <header className="post__head">
          <span className="post__avatar" aria-hidden="true">
            <img src={mark} alt="" width="16" height="24" />
          </span>
          <span className="post__who">
            <span className="post__handle">tasty_gyros_</span>
            <span className="post__name">Tasty Gyros</span>
          </span>
          <Icon name="dots" size={18} className="post__more" />
        </header>

        <a
          className="post__media"
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img {...props} alt={post.alt} loading="lazy" decoding="async" />
          <span className="vh">Open {INSTAGRAM_HANDLE} on Instagram</span>
        </a>

        {/* Decorative: these are card furniture, not controls and not counts. */}
        <footer className="post__foot" aria-hidden="true">
          <span className="post__act">
            <Icon name="heart" size={19} />
            {post.likes}
          </span>
          <span className="post__act">
            <Icon name="bubble" size={19} />
            {post.comments}
          </span>
          <span className="post__act">
            <Icon name="send" size={19} />
            {post.shares}
          </span>
          <span className="post__dots">
            <i className="is-on" />
            <i />
            <i />
          </span>
          <Icon name="bookmark" size={19} className="post__save" />
        </footer>
      </article>
    </li>
  );
}

export default function Gallery() {
  return (
    <section className="gallery section on-warm" aria-labelledby="gallery-title">
      <div className="container">
        <Reveal className="gallery__head">
          <p className="gallery__kicker">On the feed:</p>
          <h2 id="gallery-title" className="gallery__title">
            Much gyros love
          </h2>
          <p className="gallery__sub">Straight off the counter, straight to the grid</p>
        </Reveal>

        <ul className="gallery__grid">
          {POSTS.map((p) => (
            <Post post={p} key={p.key} />
          ))}
        </ul>

        <div className="gallery__foot">
          <a
            className="btn btn--ghost gallery__follow"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="instagram" size={19} />
            Follow {INSTAGRAM_HANDLE}
            <Icon name="external" size={15} />
          </a>
          <p className="gallery__note">
            Our own photography, laid out as posts, not a live embed. The like, comment and
            share figures are placeholders for this concept.
          </p>
        </div>
      </div>
    </section>
  );
}
