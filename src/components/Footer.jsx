import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import { navLinks } from '../data/nav.js';
import {
  locations,
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
  FACEBOOK_URL,
  TIKTOK_URL,
  ALLERGEN_URL,
  COMPANY_REG,
} from '../data/locations.js';
import './Footer.css';

const SOCIALS = [
  { href: INSTAGRAM_URL, icon: 'instagram', label: `Instagram — ${INSTAGRAM_HANDLE}` },
  { href: FACEBOOK_URL, icon: 'facebook', label: 'Facebook' },
  { href: TIKTOK_URL, icon: 'tiktok', label: 'TikTok' },
];

export default function Footer() {
  return (
    <footer className="ftr" id="contact">
      <div className="container ftr__inner">
        <div className="ftr__brand">
          <Logo tone="warm" />
          <ul className="ftr__socials">
            {SOCIALS.map((s) => (
              <li key={s.icon}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <Icon name={s.icon} size={20} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="ftr__col" aria-label="Footer">
          <h2 className="ftr__h">Explore</h2>
          <ul>
            {navLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
            <li>
              <a href={ALLERGEN_URL} target="_blank" rel="noopener noreferrer">
                Allergen information
                <Icon name="external" size={14} />
              </a>
            </li>
          </ul>
        </nav>

        {locations.map((loc) => (
          <div className="ftr__col" key={loc.id}>
            <h2 className="ftr__h">{loc.name}</h2>
            <address>
              {loc.addressLines.join(', ')}
              <br />
              <a href={loc.telHref}>{loc.tel}</a>
              <br />
              <a href={`mailto:${loc.email}`}>{loc.email}</a>
            </address>
            <p className="ftr__hours">{loc.hours}</p>
          </div>
        ))}
      </div>

      <div className="container ftr__base">
        <p>
          Concept website by <strong>Laara Digital</strong> — an unaffiliated design demo for
          Tasty Gyros, not the live business site.
        </p>
        <p>Tasty Gyros · Company Reg {COMPANY_REG}</p>
      </div>
    </footer>
  );
}
