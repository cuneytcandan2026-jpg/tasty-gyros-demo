import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { locations } from '../data/locations.js';
import { useScrollLock } from '../lib/useScrollLock.js';
import { useFocusTrap } from '../lib/useFocusTrap.js';
import Icon from './Icon.jsx';
import { MeanderRule } from './Graphics.jsx';
import './OrderModal.css';

const OrderModalContext = createContext(() => {});
const BranchContext = createContext({ branch: locations[0], setBranch: () => {} });

export const useOrderModal = () => useContext(OrderModalContext);

/**
 * The branch the visitor has picked in the header.
 *
 * It is a preference, not a commitment: it decides which branch the header's
 * own "Order now" hands off to, and which one this dialog marks as current.
 * Every other "Order now" on the page still opens the dialog, so nobody is
 * ever sent to a kitchen they did not choose.
 */
export const useBranch = () => useContext(BranchContext);

/**
 * The single ordering flow for the whole page.
 *
 * Every "Order now" opens this branch selector; each branch then hands off to
 * that branch's own verified Toast ordering page. There is no cart and no
 * checkout here — the handoff is labelled as leaving the site, and the dialog
 * is never opened automatically, so a first visit is not interrupted.
 */
export function OrderModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [branch, setBranch] = useState(locations[0]);
  const dialogRef = useRef(null);
  const titleId = 'order-dialog-title';

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  useScrollLock(open);
  useFocusTrap(dialogRef, open, closeModal);

  const ctx = useMemo(() => openModal, [openModal]);
  const branchCtx = useMemo(() => ({ branch, setBranch }), [branch]);

  return (
    <OrderModalContext.Provider value={ctx}>
      <BranchContext.Provider value={branchCtx}>{children}</BranchContext.Provider>
      {open &&
        createPortal(
          <div
            className="odlg"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <div
              className="odlg__panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              ref={dialogRef}
              tabIndex={-1}
            >
              <div className="odlg__keybar">
                <MeanderRule height={16} />
              </div>

              <button
                type="button"
                className="odlg__close"
                onClick={closeModal}
                aria-label="Close"
              >
                <Icon name="close" size={22} strokeWidth={2.4} />
              </button>

              <div className="odlg__body">
                <p className="kicker">Collection</p>
                <h2 className="odlg__title" id={titleId}>
                  Which kitchen?
                </h2>
                <p className="odlg__lede">
                  Pick a branch and we&rsquo;ll open its live menu.
                </p>

                <ul className="odlg__choices">
                  {locations.map((loc) => (
                    <li key={loc.id}>
                      <a
                        className={`ochoice ${loc.id === branch.id ? 'is-current' : ''}`}
                        href={loc.orderUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          setBranch(loc);
                          closeModal();
                        }}
                      >
                        <span className="ochoice__main">
                          <span className="ochoice__place">
                            {loc.name}
                            {loc.id === branch.id && (
                              <span className="ochoice__flag">Your branch</span>
                            )}
                          </span>
                          <span className="ochoice__addr">
                            {loc.addressLines[0]} · {loc.postcode}
                          </span>
                          <span className="ochoice__hours">{loc.hours}</span>
                        </span>
                        <span className="ochoice__go" aria-hidden="true">
                          <Icon name="arrow" size={22} strokeWidth={2.4} />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                <p className="odlg__note">
                  <Icon name="external" size={15} />
                  Ordering is handled by Toast and opens in a new tab.
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </OrderModalContext.Provider>
  );
}
