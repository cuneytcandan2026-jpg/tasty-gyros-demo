import { createElement } from 'react';
import { useReveal } from '../lib/useReveal.js';

/**
 * Wraps children in a scroll-reveal container.
 * Usage: <Reveal as="section" className="section">…</Reveal>
 */
export default function Reveal({ as = 'div', className = '', style, children, delay = 0, ...rest }) {
  const [ref, visible] = useReveal();
  return createElement(
    as,
    {
      ref,
      className: `reveal ${visible ? 'is-visible' : ''} ${className}`.trim(),
      style: delay ? { ...style, transitionDelay: `${delay}ms` } : style,
      ...rest,
    },
    children,
  );
}
