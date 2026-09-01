import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://gitedelormoy.fr',
  trailingSlash: 'never',
  redirects: {
    '/photos': '/galerie',
    '/reservation': '/reserver',
    '/les-alentours': '/le-gite' // Redirige logiquement vers la présentation du gîte
  },
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
});
