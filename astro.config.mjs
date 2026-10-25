import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeBlogParagraphEmphasis from './scripts/rehype-blog-paragraph-emphasis.mjs';

export default defineConfig({
  site: 'https://top-mariage.fr',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [rehypeBlogParagraphEmphasis],
  },
});
