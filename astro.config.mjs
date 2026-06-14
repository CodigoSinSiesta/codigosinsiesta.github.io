// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import rehypeHeadingIcons from './src/lib/rehype-heading-icons.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://codigosinsiesta.com',
  integrations: [svelte(), sitemap()],
  trailingSlash: 'ignore',
  markdown: {
    rehypePlugins: [rehypeHeadingIcons],
  },
});
