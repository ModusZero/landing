// @ts-check
import { defineConfig } from 'astro/config';
import robotsTxt from 'astro-robots-txt';
import sitemap from '@astrojs/sitemap';
import compress from "astro-compress";
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

const REPO_OWNER = 'moduszero';
const REPO_NAME = 'landing';
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  experimental: {
    chromeDevtoolsWorkspace: true,
  },
  integrations: [robotsTxt(), icon(), compress(), react(), svelte(), sitemap({
    i18n: {
      defaultLocale: 'en',
      locales: {
        en: 'en',
        es: 'es',
      },
    },
  })],
  
  // Tailwind 4 se integra con su plugin de Vite (la ruta por PostCSS no resuelve `@import "tailwindcss"` en Vite 8).
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@lucide/svelte'],
    },
  },

  site: isProd 
    ? `https://${REPO_OWNER}.github.io` 
    : `http://localhost:5000`,
  
  base: `/${REPO_NAME}`,
  
  trailingSlash: 'always',
  
  output: 'static', 
  
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
});