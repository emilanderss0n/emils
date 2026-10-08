import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// Links in Markdown posts that point to other sites open in a new tab.
function externalLinksInNewTab() {
  const visit = (node) => {
    if (node.tagName === 'a' && /^https?:\/\//.test(String(node.properties?.href ?? ''))) {
      node.properties.target = '_blank';
      node.properties.rel = ['noopener'];
    }
    node.children?.forEach(visit);
  };
  return visit;
}

// Shared hosting → fully static output (no Node.js server needed)
export default defineConfig({
  output: 'static',
  site: 'https://emilandersson.com',

  // Instant navigation: prefetch linked pages as they enter the viewport
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  markdown: {
    rehypePlugins: [externalLinksInNewTab],
  },

  // The old /about page now lives as a section on the home page.
  redirects: {
    '/about': '/#about',
  },

  integrations: [
    sitemap({
      // Posts are a hidden feature for now — keep them (and their feed/API)
      // out of the sitemap so they aren't discoverable by search engines.
      filter: (page) =>
        !page.includes('/posts') &&
        !page.includes('/about') &&
        !page.includes('/rss.xml') &&
        !page.includes('/api/'),
    }),
  ],
});