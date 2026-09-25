import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://top-mariage.fr',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
