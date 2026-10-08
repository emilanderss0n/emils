// One cell of the footer wordmark's halftone grid (see SiteFooter.astro): a soft white
// dot that fades out to the cell's edges, as an SVG data URI.
export function halftoneDot(pitch: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${pitch}" height="${pitch}"><radialGradient id="d"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><rect width="${pitch}" height="${pitch}" fill="url(#d)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
