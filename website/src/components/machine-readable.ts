import { identity, projects, publications, elsewhere, cvProfiles, cvDownload } from '../content.ts';

export function machineReadableFiles(): Record<string, string> {
  const overview = `# ${identity.name}

> ${identity.description}

Website: ${identity.url}/
Contact: ${identity.email}

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

${cvProfiles.map(p => `- [${p.label}](${cvDownload(p.filename)})`).join('\n')}

## Elsewhere

${elsewhere.map(p => `- [${p.name}](${p.url}): ${p.detail}`).join('\n')}
`;
  const index = `# ${identity.name}

> ${identity.description}

This is a personal website, not a company website. The CVs contain the full formal record.

## Overview

- [Profile, projects, and publications](${identity.url}/index.md): Concise Markdown overview generated from the website's shared content.

## CVs

${cvProfiles.map(p => `- [${p.label}](${cvDownload(p.filename)}): PDF from the latest tagged CV release.`).join('\n')}

## Optional

- [Personal website](${identity.url}/): Full narrative, experience, and research context in static HTML.
- [GitHub](https://github.com/mhyrzt): Source code and experiments.
`;
  return { 'llms.txt': index, 'index.md': overview };
}
