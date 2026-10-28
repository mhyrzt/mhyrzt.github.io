# [mhyrzt.github.io](https://mhyrzt.github.io)

Personal website built with Vite, TypeScript, Bun, and [WebTUI](https://webtui.ironclad.sh/).
Tokyo Night themes, static HTML, and a Fourier 𝓜 visualization.
Includes social previews, profile structured data, sitemap, and generated `llms.txt` / `index.md`.

## Development

Requires Bun 1.3.14 and just:

```sh
cd website
just install
just dev
```

```sh
just install-browsers          # once, for browser checks
just check                    # math tests, build, browser tests
just preview
```

Run `just` to list commands, including `glyph` and `social` asset generation.

GitHub Actions validates changes and deploys `website/dist/` from `main` to Pages.
Content lives in `website/src/content.ts` and `website/src/components/page.ts`.
See [design notes](docs/website-design.md) for architecture and attribution details;
font and theme licenses are in `website/public/licenses/`.

## CV

[CV sources and commands](CV/README.md). Timestamped tags publish three PDF variants
as [GitHub Releases](https://github.com/mhyrzt/mhyrzt.github.io/releases).
