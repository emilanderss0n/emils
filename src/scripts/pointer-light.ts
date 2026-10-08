// A soft light that follows the pointer over an area: the footer wordmark (wordmark-light.ts)
// and the Services stage (services-stage.ts). The light trails the pointer and glides to a
// stop rather than sticking to it. While the pointer is over the area, `lit` carries
// data-lit, and each target gets the light's position relative to itself as --x / --y (px).
// Mouse and trackpad only.

// How long the light takes to cover most of the distance to the pointer (ms).
const LAG = 140;

export function followPointer(area: HTMLElement, lit: HTMLElement, targets: HTMLElement[]): void {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const target = { x: 0, y: 0 };
  const light = { x: 0, y: 0 };
  let frame = 0;
  let last = 0;

  const place = () => {
    for (const el of targets) {
      const box = el.getBoundingClientRect();
      el.style.setProperty('--x', `${light.x - box.left}px`);
      el.style.setProperty('--y', `${light.y - box.top}px`);
    }
  };

  const step = (now: number) => {
    // Eases toward the pointer by the same amount per millisecond at any frame rate.
    const ease = 1 - Math.exp(-(now - last) / LAG);
    last = now;
    light.x += (target.x - light.x) * ease;
    light.y += (target.y - light.y) * ease;
    place();
    const settled = Math.abs(target.x - light.x) < 0.5 && Math.abs(target.y - light.y) < 0.5;
    frame = settled ? 0 : requestAnimationFrame(step);
  };

  const follow = () => {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(step);
  };

  area.addEventListener('pointerenter', (event) => {
    // The light fades in where the pointer enters, instead of sliding over from where it left.
    light.x = target.x = event.clientX;
    light.y = target.y = event.clientY;
    place();
    lit.setAttribute('data-lit', '');
  });
  area.addEventListener('pointermove', (event) => {
    target.x = event.clientX;
    target.y = event.clientY;
    follow();
  });
  area.addEventListener('pointerleave', () => lit.removeAttribute('data-lit'));
  // The page can scroll under a still pointer; keep the light where the pointer is.
  window.addEventListener('scroll', () => lit.hasAttribute('data-lit') && place(), { passive: true });
}
