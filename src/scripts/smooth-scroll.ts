// Lenis smooth scrolling (https://lenis.darkroom.engineering), for mouse and trackpad
// only. Phones and tablets keep native scrolling, and so does anyone who prefers
// reduced motion. In-page links (#work, #about…) scroll smoothly too, stopping below
// the fixed header.
import Lenis from 'lenis';

export function initSmoothScroll(): Lenis | undefined {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reduceMotion) return;

  // Lenis reads the CSS scroll-padding-top itself, so anchors need no extra offset.
  return new Lenis({ autoRaf: true, anchors: true });
}
