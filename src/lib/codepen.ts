// Pens shown under "More projects", mixed in with the GitHub repos.
// CodePen blocks automated requests, so unlike the repos these are listed by hand.
// A pen's URL is https://codepen.io/emilandersson/pen/<slug>.
import type { MoreItem } from '@lib/more-projects';

const codepenUser = 'emilandersson';
export const codepenProfile = `https://codepen.io/${codepenUser}`;

const pens = [
  { slug: 'bNNOYyK', title: 'The Amazing Stress Ball', text: 'Drag and release the ball to make it spin and bounce, as a stress ball or a tennis ball.' },
  { slug: 'OPXEMWV', title: 'Loading Bar Animation', text: 'A glowing loading bar that streaks across a dark screen.' },
  { slug: 'jEbOKed', title: 'Stacked Cards', text: 'A deck of content cards stacked on top of each other.' },
  { slug: 'bNVEZgr', title: 'Captcha Slider Concept', text: 'A contact form that asks you to slide to the right number to prove you are human.' },
  { slug: 'pvJyNrm', title: 'Expanding Dots (GSAP)', text: 'Rings of dots that ripple out from a button, animated with GSAP.' },
  { slug: 'GggeONK', title: 'Animated Radio Buttons', text: 'Card-style radio buttons with animated icons and a dark mode.' },
];

/** Pens as rows for the "More projects" list. */
export function getPens(): MoreItem[] {
  return pens.map((pen) => ({
    name: pen.title,
    text: pen.text,
    href: `https://codepen.io/${codepenUser}/pen/${pen.slug}`,
    label: { text: 'CodePen', color: 'var(--heading)' },
    meta: [],
  }));
}
