/**
 * Scroll reveal — one-shot entrance animations for content below the fold.
 *
 * The script only decides *when* something reveals. Every visual is a CSS
 * variant in styles/animations.css, so adding a new look means adding one rule
 * pair there — no changes in here.
 *
 * Markup API
 *   data-reveal="<variant>"       Reveal this element when it scrolls into view.
 *                                 Empty value falls back to the default fade-up.
 *   data-reveal-items="<variant>" Tag every direct child of this container with
 *                                 data-reveal="<variant>" and stagger them.
 *                                 Handy for grids and generated content.
 *   data-reveal-stagger="<ms>"    Stagger step between items in this container.
 *
 * Timing composes from three inherited custom properties:
 *   --reveal-intro   page-load offset, set here on the first on-screen batch
 *                    so the hero intro finishes before the fold below moves
 *   --reveal-base    subtree offset, set in markup on a wrapper
 *   --reveal-delay   per element, set by the stagger pass or in markup
 *
 * Once an element's transition finishes it is marked data-reveal-settled,
 * which drops its `transition` in CSS. Grid layouts (column-rule/row-rule)
 * need this: a `transition-property` referencing transform/filter/opacity
 * left declared forever hints the compositor to keep the element on its own
 * layer indefinitely, which can paint above a parent's gap-decoration rules
 * at rest, not just mid-animation. Settling matches what the old .anim-done
 * class did for the keyframe system it replaced — retire the animation
 * machinery once it has nothing left to do.
 */

const CONTAINER = '[data-reveal-items], [data-reveal-stagger]';
const STAGGER_STEP = 60;

/** Reveal slightly before the element touches the bottom edge. Kept as a fixed
 *  pixel value, not a percentage, so elements flush with the end of the page
 *  still cross the trigger line. */
const ROOT_MARGIN = '0px 0px -64px 0px';

/** Above this scroll offset the page was restored mid-document, so the load
 *  intro no longer makes sense. */
const INTRO_SCROLL_LIMIT = 120;

/** Safety net if transitionend never fires (reduced motion, or a variant
 *  whose transitioned properties happen not to change value). Generous on
 *  purpose — it's a no-op in the normal case, transitionend wins the race. */
const SETTLE_FALLBACK_MS = 4000;

let observer: IntersectionObserver | null = null;
let introOffset = 0;
let introPending = false;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Strip the reveal transition once it's done animating. */
export function settleReveal(el: Element): void {
  el.setAttribute('data-reveal-settled', '');
}

function reveal(el: Element): void {
  el.setAttribute('data-revealed', '');

  const handleEnd = (e: TransitionEvent) => {
    if (e.target !== el) return; // let a child's or ::after's own transition pass through
    el.removeEventListener('transitionend', handleEnd);
    settleReveal(el);
  };
  el.addEventListener('transitionend', handleEnd);
  window.setTimeout(() => {
    el.removeEventListener('transitionend', handleEnd);
    settleReveal(el);
  }, SETTLE_FALLBACK_MS);
}

function toMs(value: string | undefined, fallback: number): number {
  const parsed = Number.parseFloat(value ?? '');
  return Number.isFinite(parsed) ? parsed : fallback;
}

/** Tag container children and hand out stagger delays. Safe to re-run. */
function prepare(root: ParentNode): void {
  root.querySelectorAll<HTMLElement>('[data-reveal-items]').forEach((container) => {
    const variant = container.dataset.revealItems ?? '';
    for (const child of Array.from(container.children)) {
      if (!child.hasAttribute('data-reveal')) child.setAttribute('data-reveal', variant);
    }
  });

  root.querySelectorAll<HTMLElement>(CONTAINER).forEach((container) => {
    const step = toMs(container.dataset.revealStagger, STAGGER_STEP);
    let index = 0;

    container.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      // Anything owned by a nested container staggers on its own.
      if (el.parentElement?.closest(CONTAINER) !== container) return;
      if (!el.style.getPropertyValue('--reveal-delay')) {
        el.style.setProperty('--reveal-delay', `${index * step}ms`);
      }
      index += 1;
    });
  });
}

function getObserver(): IntersectionObserver {
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        if (introPending) el.style.setProperty('--reveal-intro', `${introOffset}ms`);
        reveal(el);
        observer?.unobserve(el);
      }
      // The first callback carries every element observed at init, so only that
      // batch waits for the page intro. Later ones react straight to the scroll.
      introPending = false;
    },
    { rootMargin: ROOT_MARGIN, threshold: 0 }
  );

  return observer;
}

/** Hook up an element created after init (e.g. a lazily hydrated card). */
export function observeReveal(el: Element): void {
  if (!el.hasAttribute('data-reveal') || el.hasAttribute('data-revealed')) return;
  if (prefersReducedMotion()) {
    reveal(el);
    return;
  }
  getObserver().observe(el);
}

export function initScrollReveal(): void {
  const root = document.documentElement;
  // Tells the inline failsafe in BaseLayout that the module made it through.
  root.setAttribute('data-reveal-ready', '');
  root.setAttribute('data-reveal-active', '');

  // Elements tagged by data-reveal-items get their data-reveal attribute here,
  // not from the server HTML. Without this guard, applying it would move them
  // from their settled state into the hidden one *through a transition* — the
  // card would animate out, then the observer would animate it back in.
  // Prime with transitions off, flush that state, then switch them on.
  root.setAttribute('data-reveal-priming', '');
  prepare(document);
  void root.offsetHeight;
  root.removeAttribute('data-reveal-priming');

  if (prefersReducedMotion()) {
    document.querySelectorAll('[data-reveal]').forEach(reveal);
    return;
  }

  introOffset = toMs(root.dataset.revealIntro, 0);
  introPending = introOffset > 0 && window.scrollY < INTRO_SCROLL_LIMIT;

  const io = getObserver();
  document
    .querySelectorAll('[data-reveal]:not([data-revealed])')
    .forEach((el) => io.observe(el));
}
