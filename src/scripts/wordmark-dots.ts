// Footer wordmark, with a mouse: the alias's dots ("/ Moxo") drawn on canvases, one per
// letter, so each dot can move on its own. They copy the halftone filter's dots they
// replace (SiteFooter.astro, lib/halftone.ts) and take the same pointer light, and the
// pointer pushes them: coming onto the dots bursts the ones around it outward, moving
// through them scatters them, and each one springs back into place (dot-spring.ts).
import { SCREEN, screenDot } from '@lib/halftone';
import { createDots, settleDots, throwDots, toPx, type Dots } from './dot-spring';

// How far the pointer reaches (em of the wordmark). How far a dot right at the pointer is
// thrown when the pointer comes onto the dots (em), and for each px it moves (px).
// The furthest any dot goes (em).
const REACH = 0.4;
const BURST = 0.065;
const PUSH = 0.18;
const SPREAD = 0.07;

// How finely the letter's shape is sampled to place the dots (pixels per CSS px), and how
// many steps of opacity the dots are batched into when drawing.
const SAMPLE = 1;
const LEVELS = 32;
// How long the wordmark has to keep its size before its dots are placed again (ms).
const RESIZED = 150;

// A letter's dots, with their homes in the letter's box.
interface Letter extends Dots {
  el: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  // How far the canvas reaches past the letter's box on each side (px).
  spill: number;
  // How strongly the blurred shape covers each dot.
  cover: Float32Array;
  // The box the dots spread over, a cell past the outermost (left, top, right, bottom).
  bounds: number[];
  // Radius and opacity of the screen's dot for each step of cover (see screenDot).
  sizes: Float32Array;
  alphas: Float32Array;
}

export function initWordmarkDots(card: HTMLElement, wordmark: HTMLElement, elements: HTMLElement[]): ((x: number, y: number) => void) | null {
  const canMove =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  if (!canMove || elements.length === 0) return null;

  const light = { x: -1e5, y: -1e5 };
  const pointer = { x: 0, y: 0 };
  let letters: Letter[] = [];
  let em = 0;
  let glow = 0;
  let dim = 1;
  let frame = 0;
  let last = 0;
  let rebuild = 0;

  const build = () => {
    const first = getComputedStyle(elements[0]);
    glow = toPx(first.getPropertyValue('--glow'));
    dim = parseFloat(first.getPropertyValue('--dim'));
    em = parseFloat(getComputedStyle(wordmark).fontSize);
    const color = getComputedStyle(wordmark).color;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    letters = elements.map((el, i) => measure(el, letters[i]?.canvas, Math.ceil(SPREAD * em), color, dpr));
    wordmark.setAttribute('data-dots', '');
    wake();
  };

  // While the wordmark is being resized, the filter's dots stand in.
  const resized = () => {
    if (!letters.length) return build();
    wordmark.removeAttribute('data-dots');
    clearTimeout(rebuild);
    rebuild = window.setTimeout(build, RESIZED);
  };

  const step = (now: number) => {
    const dt = Math.min(now - last, 50) / 1000;
    last = now;
    const lit = parseFloat(getComputedStyle(wordmark).getPropertyValue('--light')) || 0;
    let moving = false;
    for (const letter of letters) {
      moving = settleDots(letter, dt) || moving;
      const box = letter.el.getBoundingClientRect();
      paint(letter, light.x - box.left, light.y - box.top, lit);
    }
    // The light also fades in and out (contact.css); keep drawing until it has.
    const fading = lit !== (wordmark.hasAttribute('data-lit') ? 1 : 0);
    frame = moving || fading ? requestAnimationFrame(step) : 0;
  };

  const wake = () => {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(step);
  };

  // Draws a letter's dots, with the light at lx, ly (relative to the letter) and lit as
  // far as it has faded in. Dots of the same opacity are filled together.
  const paint = ({ ctx, canvas, spill, count, home, offset, cover, sizes, alphas }: Letter, lx: number, ly: number, lit: number) => {
    ctx.clearRect(-spill, -spill, canvas.width, canvas.height);
    const paths: Path2D[] = [];
    for (let i = 0; i < count; i++) {
      const x = home[i * 2] + offset[i * 2];
      const y = home[i * 2 + 1] + offset[i * 2 + 1];
      // The light: full strength at its center, fading out to --dim at --glow. Like the
      // filter, it makes the dots bigger as well as brighter.
      const strength = dim + (1 - dim) * lit * Math.max(0, 1 - Math.hypot(x - lx, y - ly) / glow);
      const level = Math.min(255, Math.round(cover[i] * strength * 255));
      const radius = sizes[level];
      const opacity = Math.round(strength * alphas[level] * LEVELS);
      if (radius <= 0 || opacity === 0) continue;
      const path = (paths[opacity] ??= new Path2D());
      path.moveTo(x + radius, y);
      path.arc(x, y, radius, 0, Math.PI * 2);
    }
    paths.forEach((path, opacity) => {
      ctx.globalAlpha = opacity / LEVELS;
      ctx.fill(path);
    });
  };

  // Throws the dots around a point outward; `distance` is how far for a dot right at it.
  const push = (x: number, y: number, distance: number) => {
    for (const letter of letters) {
      const box = letter.el.getBoundingClientRect();
      throwDots(letter, x - box.left, y - box.top, distance, REACH * em, SPREAD * em);
    }
    wake();
  };

  // Whether a point is over the dots: inside a letter's spread of dots.
  const isOver = (x: number, y: number) =>
    letters.some(({ el, bounds }) => {
      const box = el.getBoundingClientRect();
      return x - box.left > bounds[0] && x - box.left < bounds[2] && y - box.top > bounds[1] && y - box.top < bounds[3];
    });

  // Coming onto the dots bursts them outward; moving through them scatters them.
  let over = false;
  const follow = (event: PointerEvent) => {
    const moved = Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y);
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    const wasOver = over;
    over = isOver(pointer.x, pointer.y);
    const distance = (over && !wasOver ? BURST * em : 0) + Math.min(moved, REACH * em) * PUSH;
    if (distance > 0) push(pointer.x, pointer.y, distance);
  };

  // The dots are placed once the footer is a screen away, so the work never lands on the
  // page's intro, and again whenever the wordmark changes size.
  void document.fonts.ready.then(() => {
    const near = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        near.disconnect();
        new ResizeObserver(resized).observe(wordmark);
      },
      { rootMargin: '100% 0px' },
    );
    near.observe(wordmark);
  });
  card.addEventListener('pointerenter', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    over = false;
    wake();
  });
  card.addEventListener('pointermove', (event) => letters.length && follow(event));
  card.addEventListener('pointerleave', wake);

  return (x, y) => {
    light.x = x;
    light.y = y;
    wake();
  };

}

// Finds where the halftone filter puts its dots on one letter, and sets up its canvas,
// reaching `spill` px past the letter's box for the dots that are thrown out of it.
function measure(el: HTMLElement, canvas: HTMLCanvasElement | undefined, spill: number, color: string, dpr: number): Letter {
  const style = getComputedStyle(el);
  const pitch = Number(/halftone-(\d+)/.exec(getComputedStyle(el, '::before').filter)?.[1] ?? 0);
  const box = el.getBoundingClientRect();

  // The letter's baseline, from a marker sat on it.
  const marker = document.createElement('i');
  marker.style.cssText = 'display: inline-block; width: 0; height: 0';
  el.append(marker);
  const baseline = marker.getBoundingClientRect().top - box.top;
  marker.remove();

  // Draw the letter's shape where the filter sees it, then blur it like the filter does,
  // but only at the centers of the grid's cells, where the dots sit.
  const width = Math.ceil(box.width * SAMPLE);
  const height = Math.ceil(box.height * SAMPLE);
  const shape = document.createElement('canvas');
  shape.width = width;
  shape.height = height;
  const sctx = shape.getContext('2d', { willReadFrequently: true })!;
  sctx.scale(SAMPLE, SAMPLE);
  sctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  sctx.fillText(el.dataset.char ?? '', parseFloat(style.paddingLeft), baseline);
  const pixels = sctx.getImageData(0, 0, width, height).data;
  const alpha = new Float32Array(width * height);
  for (let i = 0; i < alpha.length; i++) alpha[i] = pixels[i * 4 + 3] / 255;

  const sigma = SCREEN.blur * pitch * SAMPLE;
  const reach = Math.ceil(sigma * 3);
  const kernel = Float32Array.from({ length: reach * 2 + 1 }, (_, i) => Math.exp(-((i - reach) ** 2) / (2 * sigma ** 2)));
  const total = kernel.reduce((sum, k) => sum + k, 0);

  const cols = Math.floor(box.width / pitch);
  const rows = Math.floor(box.height / pitch);
  const home: number[] = [];
  const cover: number[] = [];
  const across = new Float32Array(height);
  for (let c = 0; c < cols; c++) {
    const cx = Math.floor((c + 0.5) * pitch * SAMPLE);
    const from = Math.max(0, reach - cx);
    const to = Math.min(kernel.length, width - cx + reach);
    for (let y = 0; y < height; y++) {
      const row = y * width + cx - reach;
      let sum = 0;
      for (let k = from; k < to; k++) sum += kernel[k] * alpha[row + k];
      across[y] = sum / total;
    }
    for (let r = 0; r < rows; r++) {
      const cy = Math.floor((r + 0.5) * pitch * SAMPLE);
      let sum = 0;
      for (let k = 0; k < kernel.length; k++) {
        const y = cy + k - reach;
        if (y >= 0 && y < height) sum += kernel[k] * across[y];
      }
      const soft = sum / total;
      // Fainter than this, even full light leaves no dot.
      if (screenDot(soft, pitch)[0] <= 0) continue;
      home.push((c + 0.5) * pitch, (r + 0.5) * pitch);
      cover.push(soft);
    }
  }

  const sizes = new Float32Array(256);
  const alphas = new Float32Array(256);
  for (let i = 0; i < 256; i++) [sizes[i], alphas[i]] = screenDot(i / 255, pitch);

  spill += Math.ceil(pitch);
  canvas ??= el.appendChild(document.createElement('canvas'));
  canvas.className = 'wordmark-dots';
  canvas.width = Math.ceil((box.width + spill * 2) * dpr);
  canvas.height = Math.ceil((box.height + spill * 2) * dpr);
  Object.assign(canvas.style, {
    left: `${-spill}px`,
    top: `${-spill}px`,
    width: `${canvas.width / dpr}px`,
    height: `${canvas.height / dpr}px`,
  });
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, spill * dpr, spill * dpr);
  ctx.fillStyle = color;

  const xs = home.filter((_, i) => i % 2 === 0);
  const ys = home.filter((_, i) => i % 2 === 1);

  return {
    ...createDots(home),
    el,
    canvas,
    ctx,
    spill,
    cover: new Float32Array(cover),
    bounds: [Math.min(...xs) - pitch, Math.min(...ys) - pitch, Math.max(...xs) + pitch, Math.max(...ys) + pitch],
    sizes,
    alphas,
  };
}
