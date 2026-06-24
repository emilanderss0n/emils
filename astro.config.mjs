import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// Shared hosting → fully static output (no Node.js server needed)
export default defineConfig({
  output: 'static',
  site: 'https://emils.net',

  vite: {
    plugins: [tailwindcss()],
  },
});