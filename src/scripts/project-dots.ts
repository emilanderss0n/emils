// Featured Work row, with a mouse: the row's dot grid (sections/work.css) drawn on a
// canvas, so the dots can move. It copies the grid it replaces, light included, and fades
// in and out with the row's hover the same way. The pointer nudges the dots aside as it
// moves through them, more gently than the footer wordmark's and with no burst, and they
// spring back (dot-spring.ts). The canvas is set up on the first hover.
import { createDots, settleDots, throwDots, toPx, type Dots } from './dot-spring';

// How far the pointer reaches and the furthest a dot goes (grid cells), and how far a dot
// right at the pointer is pushed for each px the pointer moves (px).
const REACH = 5;
const SPREAD = 0.5;
const PUSH = 0.2;
// How many steps of opacity the dots are batched into when drawing.
const LEVELS = 32;

// One of the grid's two layers of dots (see .project in work.css): its soft dots drawn as
// plain circles that cover as much, at the layer's strength.
interface Layer {
  radius: number;
  strength: number;
}

export function initProjectDots(row: HTMLElement): ((x: number, y: number) => void) | null {
  const canMove =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  if (!canMove) return null;

  // In place from the start, so it rises in with the row's content rather than on its
  // own when it is first used; it stays 0 × 0 until then.
  const canvas = row.appendChild(document.createElement('canvas'));
  canvas.className = 'project-dots';
  canvas.width = canvas.height = 0;
  const ctx = canvas.getContext('2d')!;

  let dots: Dots | null = null;
  let pitch = 0;
  let fine: Layer;
  let near: Layer;
  let reach = 0;
  let faint = 0;
  let dpr = 1;
  let light: { x: number; y: number } | null = null;
  let frame = 0;
  let last = 0;

  const build = () => {
    const style = getComputedStyle(row);
    const px = (name: string) => toPx(style.getPropertyValue(name));
    pitch = px('--dot-pitch');
    reach = px('--reach');
    faint = parseFloat(style.getPropertyValue('--faint'));
    fine = layer(px('--fine-core'), px('--fine-edge'), parseFloat(style.getPropertyValue('--fine-ink')) / 100);
    near = layer(px('--near-core'), px('--near-edge'), parseFloat(style.getPropertyValue('--near-ink')) / 100);
    // The row's height is rarely a whole number of px, so the canvas is measured exactly.
    const { width, height } = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * dpr);
    canvas.height = Math.ceil(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = getComputedStyle(canvas).color;

    // A dot in the middle of every cell of the grid.
    const home: number[] = [];
    for (let y = pitch / 2; y < height; y += pitch) {
      for (let x = pitch / 2; x < width; x += pitch) home.push(x, y);
    }
    dots = createDots(home);
    row.setAttribute('data-dots', '');
  };

  const step = (now: number) => {
    const dt = Math.min(now - last, 50) / 1000;
    last = now;
    if (!dots) build();
    const moving = settleDots(dots!, dt);
    paint();
    frame = moving ? requestAnimationFrame(step) : 0;
  };

  const wake = () => {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(step);
  };

  // Like work.css: the fine dots show at --faint strength across the row and in full under
  // the light, fading out by --reach; the larger ones show only within half that, on top.
  // Dots of the same opacity are filled together.
  const paint = () => {
    const { count, home, offset } = dots!;
    const box = canvas.getBoundingClientRect();
    const lx = light ? light.x - box.left : box.width * 0.3;
    const ly = light ? light.y - box.top : box.height * 0.5;
    const fines: Path2D[] = [];
    const nears: Path2D[] = [];
    const add = (paths: Path2D[], x: number, y: number, radius: number, opacity: number) => {
      const level = Math.round(opacity * LEVELS);
      if (level <= 0) return;
      const path = (paths[level] ??= new Path2D());
      path.moveTo(x + radius, y);
      path.arc(x, y, radius, 0, Math.PI * 2);
    };
    for (let i = 0; i < count * 2; i += 2) {
      const x = home[i] + offset[i];
      const y = home[i + 1] + offset[i + 1];
      const lit = Math.max(0, 1 - Math.hypot(x - lx, y - ly) / reach);
      add(fines, x, y, fine.radius, lit + faint * (1 - lit));
      add(nears, x, y, near.radius, 2 * lit - 1);
    }
    // The whole canvas, which rounds up past the row's edge: anything left there would
    // build up frame after frame.
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    for (const [paths, { strength }] of [[fines, fine], [nears, near]] as const) {
      paths.forEach((path, level) => {
        ctx.globalAlpha = (level / LEVELS) * strength;
        ctx.fill(path);
      });
    }
  };

  const pointer = { x: 0, y: 0 };
  row.addEventListener('pointerenter', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });
  row.addEventListener('pointermove', (event) => {
    const moved = Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y);
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    if (!dots || moved === 0) return;
    const box = canvas.getBoundingClientRect();
    throwDots(dots, pointer.x - box.left, pointer.y - box.top, Math.min(moved, REACH * pitch) * PUSH, REACH * pitch, SPREAD * pitch);
    wake();
  });

  new ResizeObserver(() => {
    if (!dots) return;
    build();
    paint();
  }).observe(row);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!dots) return;
    build();
    paint();
  });

  return (x, y) => {
    light = { x, y };
    wake();
  };
}

// A layer of soft dots, solid out to `core` and gone by `edge` (px): a circle of this
// radius covers as much.
function layer(core: number, edge: number, strength: number): Layer {
  return { radius: Math.sqrt((core ** 2 + core * edge + edge ** 2) / 3), strength };
}
