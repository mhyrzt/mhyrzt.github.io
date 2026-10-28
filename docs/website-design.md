# Website audit and implementation notes

## What changed

The original site preserved a portrait, “I love computers ツ”, and social links,
but offered no evidence of engineering or research work. Its full-viewport centered
layout did not scale beyond that introduction. It loaded Tailwind's development
CDN, Font Awesome JavaScript, a remote font, and Google Tag Manager. Its favicon
target was missing.

Metadata still used the expired `mhyrzt.me` origin. The sitemap mixed site URLs,
external profiles, and a deleted root PDF. Schema.org described current student
and university employment status that the dated CV did not establish.

Read-only Pages inspection on 2026-10-28 reported legacy root-branch publishing,
`main`, and `cname: null`. Deployment therefore needs the documented one-time move
to Actions when the redesign is published.

The portrait and informal introduction survive. Tracking and runtime CDN dependencies
are removed. CV sources and `.github/workflows/cv-release.yml` are unchanged.

## WebTUI as the foundation

The implementation follows WebTUI's own homepage and documentation:

- Native single-size monospace typography with character-cell spacing (`ch`, `lh`).
- `box-="square"` and `shear-="top"` panels, with native background badges interrupting borders.
- Library tree lists, badges, buttons, separators, and native accordion markers.
- Persistent section index beside the main workspace on desktop; wrapping links on mobile.
- Official CSS layer order and component variables, with palette tokens in a separate theme layer.

There is no fake shell, invented boot sequence, terminal-command requirement,
franchise artwork, or decorative loading state. Ordinary anchors and scrolling
remain the navigation model. Tokyo Night and Tokyo Night Day use the upstream folke/tokyonight.nvim palette.
Small labels use readable foreground colors rather than low-contrast comment colors.
Day text, links, and amber annotations are darkened slightly for WCAG AA contrast.
The Fourier reconstruction is the one substantial
animated feature.

## Content evidence

The local `CV/sections/` files supply roles, dates, publication metadata, SAFER
methods, teaching figures, and the CSL usage statement. Current public READMEs for
[XRAT](https://github.com/mhyrzt/xrat), [OGym](https://github.com/mhyrzt/ogym), and
[Mahfel](https://github.com/mhyrzt/mahfel) substantiate the featured interfaces,
architectural details, documentation URLs, and development status. The user brief
supplies personal interests, Telegram URL, domain correction, and the independent
ITS work at CSL that later became RastAI.

No speedup claims, unsupported user counts, inflated titles, thesis success metrics,
or production-readiness assertions were added. SAFER remains thesis research,
separate from the two coauthored publications. Existing education dates are retained
without inventing a confirmed graduation event. Ara is described in the employment
context rather than assigned an unverified public repository.

## Architecture and tradeoffs

Vite's build-time plugin renders typed content into static HTML. A router or client
framework would add little to one page. Content remains available when JavaScript
is disabled. Optional controls are only exposed after initialization succeeds.

Canvas draws the Fourier chain efficiently; a static SVG retains the original
outline and accessibility description. The visualization reconstructs the boundary
of a mathematical script glyph, not a filled handwriting stroke. Every contour has
an independent transform, even though the selected M has one continuous contour.

The page defaults to dark. Its full light palette is optional and persistent;
storage failures are tolerated. Fonts are bundled, and the portrait loads lazily.
No runtime request to a third-party analytics or content service is needed.

Validation covers Fourier reconstruction and sampling, Chromium desktop/mobile,
narrow-phone/tablet overflow, keyboard access, no-JavaScript content, reduced motion,
theme persistence, Canvas output, browser errors, metadata, and automated axe rules
in both themes. This is not a claim of complete Safari, Firefox, screen-reader, or
live-deployment verification. Those are distinct evidence boundaries.

## Discovery

Open Graph and Twitter metadata point to a 1200×630 PNG. Canonical URLs, sitemap,
robots.txt, and ProfilePage/Person JSON-LD use the current origin. The error page
has `noindex`. The build generates `llms.txt` and `index.md` from shared content,
with discovery links in the HTML head. These follow the llmstxt.org proposal;
they do not guarantee crawler adoption, search rankings, or AI citations.
