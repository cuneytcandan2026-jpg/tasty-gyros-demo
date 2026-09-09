import { locations } from '../data/locations.js';
import { img } from '../lib/images.js';
import Icon from './Icon.jsx';
import Reveal from './Reveal.jsx';
import { MeanderRule } from './Graphics.jsx';
import './Locations.css';

export default function Locations() {
  return (
    <section className="locs" id="locations" aria-labelledby="locs-title">
      <MeanderRule height={20} className="locs__key" />

      <div className="container section">
        <Reveal className="locs__head">
          <p className="kicker">Two kitchens</p>
          <h2 id="locs-title" className="locs__title">
            Find your
            <br />
            Greek fix.
          </h2>
        </Reveal>

        <ul className="locs__grid">
          {locations.map((loc, i) => {
            const props = img(loc.image, '(max-width: 860px) 88vw, 42vw');
            return (
              <li key={loc.id}>
                <Reveal className="loc" delay={i * 90}>
                  <div className="loc__figure">
                    <img
                      {...props}
                      className="loc__img"
                      alt={loc.alt}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="loc__pin tilt-b">{loc.shortName}</span>
                  </div>

                  <div className="loc__body">
                    <h3 className="loc__name">{loc.name}</h3>

                    <address className="loc__address">
                      {loc.addressLines.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </address>

                    <p className="loc__hours">
                      <Icon name="clock" size={18} />
                      {loc.hours}
                    </p>
                    <p className="loc__note">{loc.note}</p>

                    <div className="loc__actions">
                      <a
                        className="btn btn--lemon"
                        href={loc.orderUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon name="bag" size={18} />
                        Order from {loc.shortName}
                        <Icon name="external" size={15} />
                      </a>
                      <a
                        className="btn btn--ghost"
                        href={loc.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon name="directions" size={18} />
                        Directions
                        <Icon name="external" size={15} />
                      </a>
                    </div>

                    <p className="loc__ext">
                      Collection orders open on {loc.orderLabel} in a new tab. Delivery via{' '}
                      <a href={loc.deliveryUrl} target="_blank" rel="noopener noreferrer">
                        {loc.deliveryLabel}
                        <Icon name="external" size={13} />
                      </a>
                      .
                    </p>

                    <p className="loc__tel">
                      <a href={loc.telHref}>
                        <Icon name="phone" size={18} />
                        {loc.tel}
                      </a>
                    </p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
