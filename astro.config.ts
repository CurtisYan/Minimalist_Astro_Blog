import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { siteConfig } from './src/config/site';

// No custom rehype transforms for images: keep Markdown images as plain <img> output.

export default defineConfig({
  site: siteConfig.siteUrl,
  markdown: {
    rehypePlugins: []
  },
  integrations: [sitemap()]
});
