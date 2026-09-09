import { useEffect, useState } from 'react';
import { useOrderModal } from './OrderModal.jsx';
import Icon from './Icon.jsx';
import './StickyOrderBar.css';

/**
 * Mobile-only ordering bar. It appears once the hero has scrolled away and
 * hides again over the footer; the footer also reserves matching bottom
 * padding, so the bar never covers content.
 */
export default function StickyOrderBar() {
  const openOrder = useOrderModal();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('.hero');
    const footer = document.querySelector('.ftr');
    if (!hero) return undefined;

    let pastHero = false;
    let atFooter = false;
    const sync = () => setShown(pastHero && !atFooter);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === hero) pastHero = !entry.isIntersecting;
          if (entry.target === footer) atFooter = entry.isIntersecting;
        });
        sync();
      },
      { threshold: 0.12 },
    );

    io.observe(hero);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`sbar ${shown ? 'is-shown' : ''}`} aria-hidden={!shown}>
      <button
        type="button"
        className="btn btn--block"
        onClick={openOrder}
        tabIndex={shown ? 0 : -1}
      >
        <Icon name="bag" size={18} />
        Order now
      </button>
    </div>
  );
}
