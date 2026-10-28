# [mhyrzt.github.io](https://mhyrzt.github.io)

Personal website built with Vite, TypeScript, Bun, and [WebTUI](https://webtui.ironclad.sh/).
Tokyo Night themes, static HTML, and a Fourier 𝓜 visualization.

## Development

Requires Bun 1.3.14:

```sh
cd website
bun install --frozen-lockfile
bun run dev
```

```sh
bun test src
bun run build                 # includes type checking
bunx playwright install chromium
bun run test:browser
bun run preview
```

GitHub Actions validates changes and deploys `website/dist/` from `main` to Pages.
Content lives in `website/src/content.ts` and `website/src/components/page.ts`.
See [design notes](docs/website-design.md) for architecture and attribution details;
font and theme licenses are in `website/public/licenses/`.

## CV

[CV sources and commands](CV/README.md). Timestamped tags publish three PDF variants
as [GitHub Releases](https://github.com/mhyrzt/mhyrzt.github.io/releases).
