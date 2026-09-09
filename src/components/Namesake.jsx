import { Starburst, MeanderRule } from './Graphics.jsx';
import Reveal from './Reveal.jsx';
import './Namesake.css';

/**
 * The name, said out loud.
 *
 * A taverna fascia: the two words stacked as one solid block of signage, framed
 * top and bottom by the meander key the way a real shopfront board is. Both
 * words are five letters, so stacked they set as a near-square lockup — that is
 * the whole reason this treatment works, and why the name is split across two
 * lines rather than run across one.
 *
 * The letters are split into spans purely so they can be mounted one at a time,
 * so the split is hidden from assistive tech and the real name is exposed once,
 * intact, alongside it.
 */
const LINES = ['Tasty', 'Gyros'];

export default function Namesake() {
  let n = -1;

  return (
    <section className="namesake on-deep" aria-labelledby="namesake-title">
      <div className="namesake__wash" aria-hidden="true" />

      <MeanderRule height={16} className="namesake__key" />

      <div className="container namesake__inner">
        <Reveal className="namesake__kicker-wrap">
          <p className="kicker">Say it with us</p>
        </Reveal>

        <Reveal as="h2" id="namesake-title" className="namesake__sign">
          <span className="vh">Tasty Gyros</span>
          {LINES.map((line) => (
            <span className="namesake__line" key={line} aria-hidden="true">
              {[...line].map((ch, i) => {
                n += 1;
                return (
                  <span className="namesake__ltr" key={i} style={{ '--i': n }}>
                    {ch}
                  </span>
                );
              })}
            </span>
          ))}
        </Reveal>

        <Reveal className="namesake__foot" delay={120}>
          <p className="namesake__sub">
            Greek street food · Two London kitchens · Since 2021
          </p>
        </Reveal>

        {/* Warm, not tomato: the label shrinks to ~14px at the mobile floor, which
            is normal-size text — white on --tomato is 3.5:1 and would fail there.
            Blue-deep on warm white clears AA at every size this sticker takes. */}
        <Starburst tone="warm" className="namesake__sticker tilt-a">
          It&rsquo;s YEE-ros
        </Starburst>
      </div>

      <MeanderRule height={16} className="namesake__key" />
    </section>
  );
}
