import { identity, projects, publications, elsewhere } from '../content.ts';

export function machineReadableFiles(): Record<string, string> {
  const overview = `# ${identity.name}

> ${identity.description}

Website: ${identity.url}/

## Selected work

${projects.map(p => `### ${p.name}

${p.description}

${p.contribution}

${p.stack}

- [Source](${p.source})
- [Documentation](${p.docs})`).join('\n\n')}

## Publications

${publications.map(p => `- [${p.title}](${p.url}): ${p.authors}. ${p.venue}.`).join('\n')}

## CV

- [CV](${identity.cv})

## Elsewhere

${elsewhere.map(p => `- [${p.name}](${p.url}): ${p.detail}`).join('\n')}
`;
  const index = `# ${identity.name}

> ${identity.description}

This is a personal website, not a company website. The CV contains the full formal record.

## Overview

- [Profile, projects, and publications](${identity.url}/index.md): Concise Markdown overview generated from the website's shared content.

## CV

- [CV](${identity.cv}): PDF from the latest tagged CV release.

## Optional

- [Personal website](${identity.url}/): Full narrative, experience, and research context in static HTML.
- [GitHub](https://github.com/mhyrzt): Source code and experiments.
`;
  return { 'llms.txt': index, 'index.md': overview };
}
