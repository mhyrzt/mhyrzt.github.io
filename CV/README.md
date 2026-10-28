# Mahyar Riazati — CV

Three PDFs share the content in `sections/` and Source Sans Pro typography in
`cv-style.sty`. Profile files select order and level of detail:

| Profile | Source | Output | Purpose |
| --- | --- | --- | --- |
| Engineering | `profiles/engineering.tex` | `mahyar-riazati-cv.pdf` | Two pages; experience and engineering projects first. Website download. |
| Research | `profiles/research.tex` | `mahyar-riazati-research-cv.pdf` | Two pages; research, publications, and education first. |
| Full | `profiles/full.tex` | `mahyar-riazati-master-cv.pdf` | Expanded responsibilities and additional projects; no page limit. |

PDFs and build intermediates are generated under ignored `build/`; no PDFs are
committed. The top-level `.tex` files are build entrypoints. Edit facts in `sections/` so
corrections reach every version. `\ifmastercv` controls expanded detail;
`\ifresearchcv` selects Ex-RL rather than Mahfel in the short project list.
Earlier author choices remain: no title-heavy headline, no Selected Training
section, one Machine learning skills category, consistent GitHub labels.

## Build and check

Requires just and TeX Live with pdfLaTeX, latexmk, Source Sans Pro, geometry, enumitem,
titlesec, xcolor, hyperref, and needspace. Checks require Python 3 and Poppler
(`pdfinfo`, `pdftotext`, `pdffonts`); no Python packages are needed.

```sh
cd CV
just                  # All three versions, under build/
just engineering      # Default application PDF
just research
just full
just check            # Build, then run local PDF checks
just check-links      # Also verify GitHub repo links with gh
just release-assets   # Validate and create build/SHA256SUMS
just clean            # Remove intermediates, preserve PDFs
```

The checker verifies application page counts, raw and layout text order,
essential text, embedded fonts and Unicode mappings, text within page bounds,
link annotations, and LaTeX warnings. `--links` verifies GitHub repositories;
it does not test email delivery, LinkedIn, Scholar, or every external destination.
These checks support parser readability; they do not certify every ATS.

Render every page for visual review after content or styling changes:

```sh
pdftoppm -scale-to 1400 -png build/mahyar-riazati-cv.pdf /tmp/cv-engineering
pdftoppm -scale-to 1400 -png build/mahyar-riazati-research-cv.pdf /tmp/cv-research
pdftoppm -scale-to 1400 -png build/mahyar-riazati-master-cv.pdf /tmp/cv-full
```

## Tagged releases

The workflow `.github/workflows/cv-release.yml` runs when a tag matching `cv-*`
is pushed. It requires a valid calendar date and 24-hour time in the exact form `cv-YYYY-MM-DD-HH-mm`,
builds all profiles with `just release-assets`, then publishes the three PDFs
and `SHA256SUMS` as GitHub Release assets. No external repository-link checks
are required to publish; PDF validation runs before the release is created.

After committing and pushing the source, create a tag on that reviewed commit:

```sh
git tag -a cv-2026-10-28-16-18 -m "CV update for 2026-10-28 16:18 Tehran"
git push origin cv-2026-10-28-16-18
```

Use a new timestamp tag for each release; `mm` is minutes, in Tehran time. The workflow does not replace assets in an
existing release. It marks the new CV release as latest, so the website's stable
[engineering download](https://github.com/mhyrzt/mhyrzt.github.io/releases/latest/download/mahyar-riazati-cv.pdf)
follows it. That download becomes available after the first successful tagged
release. The research and full PDFs are available on the same release page.

## Editorial evidence and remaining date check

- Employment dates follow the author's LinkedIn screenshot. DevOps starts in
  May 2026, following the author's recollection of May and the stated six-month
  timeframe as of October 2026.
- MSc completion status/month has not been reconfirmed. The original CV's
  `2022–2025` education range is retained, without adding a graduation claim.
- GPAs come from the original CV; the BSc GPA is rounded to 3.10/4.00.
- SAFER is described by research problem and method using its current README;
  this is not presented as its official thesis title. No benchmark gains or
  superiority claims are added.
- MVP/core responsibility and CSL classroom/user counts are author-provided.
  RastAI feature details are supported by the author's LMS and Ara commits.
- OGym, XRAT, and Mahfel descriptions follow local project documentation. Ara is
  employment-related work, not a personal public repository. No production-scale
  or sole-ownership claims are made for those projects.
- Earlier project descriptions and teaching figures come from the original CV.
  Removed PrecoderNet and training/certificate entries are not restored.
- GitHub/LinkedIn contact URLs are printed explicitly; project links retain the
  consistent short GitHub labels requested by the author.
