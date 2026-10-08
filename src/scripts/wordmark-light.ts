// Footer wordmark: while the pointer is over the contact card, a soft light follows it
// and brightens the dots of the alias ("/ Moxo") underneath, like the hero's aura
// leaning toward the pointer. The light trails the pointer and glides to a stop rather
// than sticking to it. Mouse and trackpad only.

// How long the light takes to cover most of the distance to the pointer (ms).
const LAG = 140;

export function initWordmarkLight(): void {
  const card = document.querySelector<HTMLElement>('.contact');
  const wordmark = card?.querySelector<HTMLElement>('.wordmark');
  if (!card || !wordmark || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  // Each letter paints its own light, so each gets the light's position relative to itself.
  const chars = Array.from(wordmark.querySelectorAll<HTMLElement>('.wordmark-alias'));
  const target = { x: 0, y: 0 };
  const light = { x: 0, y: 0 };
  let frame = 0;
  let last = 0;

  const place = () => {
    for (const char of chars) {
      const box = char.getBoundingClientRect();
      char.style.setProperty('--x', `${light.x - box.left}px`);
      char.style.setProperty('--y', `${light.y - box.top}px`);
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

  card.addEventListener('pointerenter', (event) => {
    // The light fades in where the pointer enters, instead of sliding over from where it left.
    light.x = target.x = event.clientX;
    light.y = target.y = event.clientY;
    place();
    wordmark.setAttribute('data-lit', '');
  });
  card.addEventListener('pointermove', (event) => {
    target.x = event.clientX;
    target.y = event.clientY;
    follow();
  });
  card.addEventListener('pointerleave', () => wordmark.removeAttribute('data-lit'));
  // The page can scroll under a still pointer; keep the light where the pointer is.
  window.addEventListener('scroll', () => wordmark.hasAttribute('data-lit') && place(), { passive: true });
}
