# CV

Engineering (2 pages), research (2 pages), and full versions share `sections/`.
Edit content there; `profiles/` controls order and detail. PDFs are generated in
ignored `build/`, not committed.

Requires just, TeX Live (pdfLaTeX, latexmk, Source Sans Pro), Python 3, and Poppler.
From `CV/`:

```sh
just                  # build all three PDFs
just engineering      # or research / full
just check            # build and validate PDFs
just check-links      # also check GitHub links with gh
just release-assets   # PDFs and SHA256SUMS
just clean            # remove intermediates, retain PDFs
```

Push a new annotated `cv-YYYY-MM-DD-HH-mm` tag (Tehran time; `mm` is minutes) to
publish all three PDFs and checksums. The website links to the latest release.

Template adapted from [arasgungore-CV](https://github.com/arasgungore/arasgungore-CV).
