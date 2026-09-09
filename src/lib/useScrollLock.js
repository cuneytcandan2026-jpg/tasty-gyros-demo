import { useEffect } from 'react';

/** Locks body scroll (without layout shift) while `active` is true. */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    const { body, documentElement: html } = document;
    const scrollBarW = window.innerWidth - html.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (scrollBarW > 0) body.style.paddingRight = `${scrollBarW}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [active]);
}
