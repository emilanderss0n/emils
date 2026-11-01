// Dots the pointer can throw around, each on a spring that brings it back home: the
// footer wordmark's (wordmark-dots.ts) and the featured Work rows' (project-dots.ts).
// Positions are px in whatever box the caller measures its dots in.

// A thrown dot flies out and comes to a stop at the rate OUT, then drifts back home at
// the slower rate BACK (per s). With these it is furthest out after about 0.14 s and home
// after about a second.
const OUT = 14;
const BACK = 3;
// How far a dot thrown at 1 px/s gets before it turns back (px).
const CARRY = carry();
// Each dot is thrown a little harder or softer than the next, and a little off to the side
// (radians), so they scatter instead of moving as one.
const VARY = 0.4;
const SWERVE = 0.4;

export interface Dots {
  count: number;
  // Each dot's home, its distance from home and its speed (x, y pairs), and how it takes a
  // push: a scale and turn, as the two numbers of a rotation (x, y pairs).
  home: Float32Array;
  offset: Float32Array;
  speed: Float32Array;
  kick: Float32Array;
}

export function createDots(home: number[]): Dots {
  const kick = new Float32Array(home.length);
  for (let i = 0; i < home.length; i += 2) {
    const scale = 1 + (Math.random() * 2 - 1) * VARY;
    const turn = (Math.random() * 2 - 1) * SWERVE;
    kick[i] = scale * Math.cos(turn);
    kick[i + 1] = scale * Math.sin(turn);
  }
  return {
    count: home.length / 2,
    home: new Float32Array(home),
    offset: new Float32Array(home.length),
    speed: new Float32Array(home.length),
    kick,
  };
}

// Throws the dots around x, y outward: a dot right at it goes `distance` px, dots further
// off less, down to none at `reach`, and none is thrown further than `farthest`.
export function throwDots({ count, home, offset, speed, kick }: Dots, x: number, y: number, distance: number, reach: number, farthest: number): void {
  const fastest = farthest / CARRY;
  for (let i = 0; i < count * 2; i += 2) {
    const dx = home[i] + offset[i] - x;
    const dy = home[i + 1] + offset[i + 1] - y;
    const d = Math.hypot(dx, dy);
    if (d >= reach || d < 0.01) continue;
    // The speed that carries a dot `distance` out before it turns back, fading out
    // toward the edge of the reach (divided by d to turn dx, dy into a direction).
    const boost = (distance * (1 - d / reach) ** 2) / CARRY / d;
    let vx = speed[i] + (dx * kick[i] - dy * kick[i + 1]) * boost;
    let vy = speed[i + 1] + (dx * kick[i + 1] + dy * kick[i]) * boost;
    const v = Math.hypot(vx, vy);
    if (v > fastest) {
      vx *= fastest / v;
      vy *= fastest / v;
    }
    speed[i] = vx;
    speed[i + 1] = vy;
  }
}

// Moves every dot on by dt seconds. Each one is on a heavily damped spring, so it never
// overshoots: its distance from home is a fast part that fades at OUT plus a slow part
// that fades at BACK. Returns whether any dot still moves.
export function settleDots({ count, offset, speed }: Dots, dt: number): boolean {
  const fast = Math.exp(-OUT * dt);
  const slow = Math.exp(-BACK * dt);
  let moving = false;
  for (let i = 0; i < count * 2; i++) {
    const x = offset[i];
    const v = speed[i];
    if (x === 0 && v === 0) continue;
    const flight = -(v + BACK * x) / (OUT - BACK);
    const drift = x - flight;
    offset[i] = flight * fast + drift * slow;
    speed[i] = -OUT * flight * fast - BACK * drift * slow;
    if (Math.abs(offset[i]) < 0.01 && Math.abs(speed[i]) < 0.5) offset[i] = speed[i] = 0;
    else moving = true;
  }
  return moving;
}

// A length from CSS, in px (rem or px): both dot canvases take their sizes from CSS.
export function toPx(value: string): number {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return parseFloat(value) * (value.trim().endsWith('rem') ? rem : 1);
}

// The distance a dot thrown from home at 1 px/s reaches (see settleDots).
function carry(): number {
  const peak = Math.log(OUT / BACK) / (OUT - BACK);
  return (Math.exp(-BACK * peak) - Math.exp(-OUT * peak)) / (OUT - BACK);
}
