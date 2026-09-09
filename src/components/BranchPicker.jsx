import { useEffect, useId, useRef, useState } from 'react';
import { locations } from '../data/locations.js';
import { useBranch } from './OrderModal.jsx';
import Icon from './Icon.jsx';

/**
 * The header's branch switcher.
 *
 * A plain disclosure button over a list of radio-style options rather than a
 * <select>, so it can carry the pin and the branch's postcode. It closes on
 * Escape, on outside click and once a branch is picked, and it never changes
 * anything except which branch the header's "Order now" hands off to.
 */
export default function BranchPicker({ className = '' }) {
  const { branch, setBranch } = useBranch();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      // Escape has to close the innermost thing first. Inside the mobile menu
      // the focus trap is watching document in the capture phase and stops the
      // event there, so listening on window — which captures one step earlier —
      // is what lets this dropdown close on its own without taking the whole
      // menu down with it.
      e.stopPropagation();
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  return (
    <div className={`bpick ${className}`.trim()} ref={wrapRef}>
      <button
        type="button"
        className="bpick__btn"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="pin" size={17} strokeWidth={2} />
        <span className="bpick__current">{branch.shortName}</span>
        <Icon name="chevronDown" size={15} strokeWidth={2.4} className="bpick__caret" />
        <span className="vh">, change branch</span>
      </button>

      <ul className={`bpick__list ${open ? 'is-open' : ''}`} id={listId} hidden={!open}>
        {locations.map((loc) => (
          <li key={loc.id}>
            <button
              type="button"
              className={`bpick__opt ${loc.id === branch.id ? 'is-current' : ''}`}
              aria-current={loc.id === branch.id ? 'true' : undefined}
              onClick={() => {
                setBranch(loc);
                setOpen(false);
              }}
            >
              <span className="bpick__place">{loc.name}</span>
              <span className="bpick__meta">
                {loc.postcode} · {loc.hours.split('·').pop().trim()}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
