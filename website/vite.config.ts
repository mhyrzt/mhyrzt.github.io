import { defineConfig } from 'vite';
import { renderPage } from './src/components/page.ts';
import { identity } from './src/content.ts';

export default defineConfig({
  base: '/',
  plugins: [{
    name: 'static-personal-page',
    transformIndexHtml: {
      order: 'pre',
      handler: html => html.replace('<!-- PAGE -->', renderPage()).replace('<!-- SCHEMA -->', `<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Person', name: identity.name,
        url: `${identity.url}/`, image: `${identity.url}/portrait.webp`, jobTitle: 'Software Engineer',
        sameAs: ['https://github.com/mhyrzt', 'https://www.linkedin.com/in/mhyrzt/', 'https://scholar.google.com/citations?user=k-nwlcYAAAAJ'],
        knowsAbout: ['Software engineering', 'Reinforcement learning', 'Infrastructure', 'Reward shaping'],
      })}</script>`),
    },
  }],
});
