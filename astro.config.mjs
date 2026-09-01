import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://gitedelormoy.fr',
  trailingSlash: 'never', // Force la suppression du slash final sur toutes les URL
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
});
