import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Shared hosting → fully static output (no Node.js server needed)
export default defineConfig({
  output: 'static',
  site: 'https://emilandersson.com',

  // Instant navigation: prefetch linked pages as they enter the viewport
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  integrations: [
    sitemap({
      // Posts are a hidden feature for now — keep them (and their feed/API)
      // out of the sitemap so they aren't discoverable by search engines.
      filter: (page) =>
        !page.includes('/posts') &&
        !page.includes('/rss.xml') &&
        !page.includes('/api/'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});