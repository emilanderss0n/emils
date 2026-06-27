import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// Shared hosting → fully static output (no Node.js server needed)
export default defineConfig({
  output: 'static',
  site: 'https://emilandersson.com',

  vite: {
    plugins: [tailwindcss()],
  },
});