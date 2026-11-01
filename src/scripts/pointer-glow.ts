// Lights the Work section's featured rows ([data-glow]): a soft light follows the pointer
// over each row (pointer-light.ts), and the row's dots brighten under it (sections/work.css).
// With a mouse, and motion allowed, the script draws those dots itself so they can move
// (project-dots.ts).
import { followPointer } from './pointer-light';
import { initProjectDots } from './project-dots';

export function initPointerGlow(root: ParentNode = document): void {
  for (const el of root.querySelectorAll<HTMLElement>('[data-glow]')) {
    const moveLight = initProjectDots(el);
    if (moveLight) followPointer(el, el, [], moveLight);
    else followPointer(el, el, [el]);
  }
}
