// Entrance reveals for content below the hero. Elements marked [data-reveal] start
// hidden (animations.css, only once JS is known to run) and rise into place as they
// scroll into view. Elements that come into view together are staggered in reading
// order, so a section's eyebrow, heading and intro arrive one after another however
// fast the page is scrolled. Each element fires a "reveal" event with its delay, which
// the text scramble uses to start in step with it.
//
// data-reveal="contents" animates the element's children instead of the element, so a
// ruled row's lines stay put while its content rises into them.

export interface RevealDetail {
  delay: number;
  /** True when the element was scrolled past unseen and is shown without animating. */
  instant: boolean;
}

const STEP = 90;
const MAX_STEPS = 4;

/**
 * @param settle ms to hold back anything already in view when the page opens, so it
 *               arrives after the page's own intro instead of competing with it.
 */
export function initReveal(settle = 0): void {
  const pending = new Set(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (pending.size === 0) return;
  const openedAt = performance.now();

  const reveal = (el: HTMLElement, delay: number, instant = false) => {
    pending.delete(el);
    observer.unobserve(el);
    el.style.setProperty('--reveal-delay', `${Math.round(delay)}ms`);
    el.dataset.revealed = instant ? 'instant' : '';
    el.dispatchEvent(new CustomEvent<RevealDetail>('reveal', { detail: { delay, instant } }));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const entering = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => {
          const rowA = Math.round(a.boundingClientRect.top / 16);
          const rowB = Math.round(b.boundingClientRect.top / 16);
          return rowA - rowB || a.boundingClientRect.left - b.boundingClientRect.left;
        });

      const base = Math.max(0, openedAt + settle - performance.now());
      entering.forEach((entry, i) => reveal(entry.target as HTMLElement, base + Math.min(i, MAX_STEPS) * STEP));

      // Anything scrolled past without being seen (a jump to an anchor, a scroll
      // position restored on reload) shows at once, so scrolling back up finds it in place.
      for (const el of pending) {
        if (el.getBoundingClientRect().bottom < 0) reveal(el, 0, true);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );

  for (const el of pending) observer.observe(el);
}
