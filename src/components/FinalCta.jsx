import { useOrderModal } from './OrderModal.jsx';
import Icon from './Icon.jsx';
import { Doodle } from './Graphics.jsx';
import Reveal from './Reveal.jsx';
import './FinalCta.css';

export default function FinalCta() {
  const openOrder = useOrderModal();

  return (
    <section className="final on-lemon" aria-labelledby="final-title">
      <div className="container section">
        <Reveal className="final__inner">
          <Doodle name="tomato" size={58} className="final__doodle final__doodle--a" />
          <Doodle name="chip" size={58} className="final__doodle final__doodle--b" />

          <h2 id="final-title" className="final__title">
            Hungry yet?
            <br />
            Thought so.
          </h2>
          <p className="final__lede">
            Pick a kitchen and we&rsquo;ll take you straight to its live menu.
          </p>
          <button type="button" className="btn btn--blue final__btn" onClick={openOrder}>
            <Icon name="bag" size={19} />
            Order now
          </button>
        </Reveal>
      </div>
    </section>
  );
}
