import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Adds the `is-visible` class the first time an element scrolls into view.
 * No-ops (element shown immediately) when the user prefers reduced motion,
 * when IntersectionObserver is unavailable, or as a safety net after a short
 * delay so content is never left hidden if the observer never fires.
 */
export function useReveal({ threshold = 0.12, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(prefersReducedMotion());

  useEffect(() => {
    if (visible) return undefined;
    const el = ref.current;

    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    // If already on screen at mount, reveal immediately.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);

    // Safety net: never leave content hidden.
    const safety = window.setTimeout(() => setVisible(true), 1200);

    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, [visible, threshold, rootMargin]);

  return [ref, visible];
}
