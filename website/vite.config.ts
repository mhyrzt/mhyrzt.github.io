import { defineConfig } from 'vite';
import { renderPage } from './src/components/page.ts';
import { identity } from './src/content.ts';
import { machineReadableFiles } from './src/components/machine-readable.ts';

export default defineConfig({
  base: '/',
  plugins: [{
    name: 'static-personal-page',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0]?.slice(1);
        const files = machineReadableFiles();
        const content = path && Object.hasOwn(files, path) ? files[path] : undefined;
        if (content === undefined) return next();
        res.setHeader('Content-Type', path?.endsWith('.md') ? 'text/markdown; charset=utf-8' : 'text/plain; charset=utf-8');
        res.end(content);
      });
    },
    generateBundle() {
      for (const [fileName, source] of Object.entries(machineReadableFiles())) {
        this.emitFile({ type: 'asset', fileName, source });
      }
    },
    transformIndexHtml: {
      order: 'pre',
      handler: html => html.replace('<!-- PAGE -->', renderPage()).replace('<!-- SCHEMA -->', `<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org', '@type': 'ProfilePage',
        '@id': `${identity.url}/#profile`, url: `${identity.url}/`, name: identity.name,
        description: identity.description, inLanguage: 'en',
        mainEntity: {
          '@type': 'Person', '@id': `${identity.url}/#person`, name: identity.name, alternateName: 'mhyrzt',
          url: `${identity.url}/`, image: `${identity.url}/portrait.webp`, jobTitle: 'Software Engineer',
          sameAs: ['https://github.com/mhyrzt', 'https://www.linkedin.com/in/mhyrzt/', 'https://scholar.google.com/citations?user=k-nwlcYAAAAJ'],
          knowsAbout: ['Software engineering', 'Reinforcement learning', 'Infrastructure', 'Reward shaping'],
        },
      })}</script>`),
    },
  }],
});
