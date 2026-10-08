// Lights the Work section's featured rows ([data-glow]): a soft light follows the pointer
// over each row (pointer-light.ts), and the row's dots brighten under it (sections/work.css).
import { followPointer } from './pointer-light';

export function initPointerGlow(root: ParentNode = document): void {
  for (const el of root.querySelectorAll<HTMLElement>('[data-glow]')) followPointer(el, el, [el]);
}
