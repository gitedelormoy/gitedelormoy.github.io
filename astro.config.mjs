import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://www.gitedelormoy.fr',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
});
