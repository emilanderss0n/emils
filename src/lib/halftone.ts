// The footer wordmark's halftone screen (SiteFooter.astro): the letter's shape is blurred
// by `blur` × the grid size, multiplied by a grid of soft dots, and the result's alpha is
// sharpened to slope × alpha + intercept, so dots shrink toward the letter's edges.
export const SCREEN = { blur: 0.35, slope: 6, intercept: -1.2 };

// One cell of the grid: a soft white dot that fades out to the cell's edges, as an SVG
// data URI.
export function halftoneDot(pitch: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${pitch}" height="${pitch}"><radialGradient id="d"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><rect width="${pitch}" height="${pitch}" fill="url(#d)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// The dot the screen draws in one cell, as a plain circle (scripts/wordmark-dots.ts draws
// them on a canvas). `soft` is the blurred shape's alpha at the cell's center. Returns the
// radius of a circle that covers as much as the screen's dot, and its opacity, which only
// drops below 1 for the faint dots at the very edge of a letter.
export function screenDot(soft: number, pitch: number): [radius: number, alpha: number] {
  const { slope, intercept } = SCREEN;
  // Across the cell, the dot's alpha falls in a straight line from the center: it gains
  // `rise` per px toward the center, starting from 0 at `outer`, and stops at 1.
  const half = pitch / 2;
  const outer = half * (1 + intercept / (slope * soft));
  if (!(outer > 0)) return [0, 0];
  const rise = (slope * soft) / half;
  const peak = rise * outer;
  // Too faint to reach 1, the dot is a low cone: drawn as a circle with a third of the
  // cone's area, at the cone's peak opacity, it covers the same.
  if (peak <= 1) return [outer / Math.sqrt(3), peak];
  // Solid out to `inner`, then the sloped ring.
  const inner = outer - 1 / rise;
  const ring = 2 * rise * ((outer * (outer ** 2 - inner ** 2)) / 2 - (outer ** 3 - inner ** 3) / 3);
  return [Math.sqrt(inner ** 2 + ring), 1];
}
