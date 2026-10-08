// Sets --x / --y (px) on [data-glow] elements while the pointer moves over them,
// so hover highlights can follow the cursor.
export function initPointerGlow(root: ParentNode = document) {
  for (const el of root.querySelectorAll<HTMLElement>('[data-glow]')) {
    el.addEventListener('pointermove', (event) => {
      const box = el.getBoundingClientRect();
      el.style.setProperty('--x', `${event.clientX - box.left}px`);
      el.style.setProperty('--y', `${event.clientY - box.top}px`);
    });
  }
}
