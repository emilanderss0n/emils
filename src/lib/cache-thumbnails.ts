/**
 * Download CodePen thumbnails at build time so they're served locally.
 * Run before build: import { cacheCodePenThumbnails } from './cache-thumbnails.js';
 */
import fs from 'node:fs';
import path from 'node:path';

export async function cacheCodePenThumbnails(
  username: string,
  slugs: string[],
) {
  const dir = path.resolve('public/codepen-thumbs');
  fs.mkdirSync(dir, { recursive: true });

  const results: Record<string, string> = {};

  for (const slug of slugs) {
    const url = `https://shots.codepen.io/${username}/pen/${slug}-512.webp`;
    const filePath = path.join(dir, `${slug}.webp`);

    // Skip if already cached
    if (fs.existsSync(filePath)) {
      console.log(`[thumb-cache] Using cached: ${slug}`);
      results[slug] = `/codepen-thumbs/${slug}.webp`;
      continue;
    }

    try {
      const res = await fetch(url);
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        console.log(`[thumb-cache] Downloaded: ${slug} (${(buffer.length / 1024).toFixed(0)} KB)`);
        results[slug] = `/codepen-thumbs/${slug}.webp`;
      } else {
        console.warn(`[thumb-cache] Failed: ${slug} (${res.status})`);
        results[slug] = url; // fallback to remote URL
      }
    } catch (err) {
      console.warn(`[thumb-cache] Error: ${slug}`, err);
      results[slug] = url; // fallback to remote URL
    }
  }

  return results;
}
