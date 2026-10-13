// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO(owner): replace with the production domain once it is chosen.
  site: 'https://viliamkratky.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [react(), mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
