import { useEffect, useRef, useState } from 'react';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import BranchPicker from './BranchPicker.jsx';
import { navLinks } from '../data/nav.js';
import { useBranch, useOrderModal } from './OrderModal.jsx';
import { useScrollLock } from '../lib/useScrollLock.js';
import { useFocusTrap } from '../lib/useFocusTrap.js';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { branch } = useBranch();
  const openOrder = useOrderModal();
  const panelRef = useRef(null);
  const burgerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useScrollLock(menuOpen);
  useFocusTrap(panelRef, menuOpen, () => setMenuOpen(false));

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`hdr ${scrolled ? 'is-stuck' : ''}`}>
      <div className="hdr__bar container">
        <nav className="hdr__nav" aria-label="Primary">
          <ul>
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Centred and hung below the bar, so the mark breaks the rule rather
            than sitting inside it. */}
        <a href="#top" className="hdr__brand" aria-label="Tasty Gyros — back to top">
          <Logo variant="emblem" />
        </a>

        <div className="hdr__actions">
          <BranchPicker className="hdr__branch" />
          {/* The header button is branch-scoped, which is why the branch is
              named right beside it; every other "Order now" on the page opens
              the chooser instead. */}
          <a
            className="btn btn--sm hdr__order"
            href={branch.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Order now
            <span className="vh">— {branch.name}, opens {branch.orderLabel} in a new tab</span>
          </a>
        </div>

        <button
          type="button"
          className="hdr__burger"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          ref={burgerRef}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={26} strokeWidth={2.4} />
        </button>
      </div>

      <div className={`mnav ${menuOpen ? 'is-open' : ''}`} id="mobile-menu">
        <div className="mnav__scrim" onClick={closeMenu} aria-hidden="true" />
        <div className="mnav__panel on-deep" ref={panelRef} tabIndex={-1}>
          <div className="mnav__head">
            <Logo tone="warm" withText={false} />
            <button
              type="button"
              className="mnav__close"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <Icon name="close" size={24} strokeWidth={2.4} />
            </button>
          </div>

          <nav aria-label="Mobile">
            <ul className="mnav__links">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} onClick={closeMenu}>
                    <span>{link.label}</span>
                    <Icon name="arrow" size={22} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <BranchPicker className="mnav__branch" />

          <button
            type="button"
            className="btn btn--lemon btn--block"
            onClick={() => {
              closeMenu();
              openOrder();
            }}
          >
            <Icon name="bag" size={18} />
            Order now
          </button>
        </div>
      </div>
    </header>
  );
}
