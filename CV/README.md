# CV

One two-page CV, built from `mahyar-riazati-cv.tex` and `sections/`.
The generated PDF lives in ignored `build/` and is not committed.

Requires just, TeX Live (pdfLaTeX, latexmk, Source Sans Pro), Python 3, and Poppler.
From `CV/`:

```sh
just                  # build the CV
just check            # build and validate the PDF
just check-links      # also check GitHub links with gh
just release-assets   # PDF and SHA256SUMS
just clean            # remove intermediates, retain the PDF
```

Push a new annotated `cv-YYYY-MM-DD-HH-mm` tag (Tehran time; `mm` is minutes) to
publish the PDF and checksums. The website links to the latest release.

Template adapted from [arasgungore-CV](https://github.com/arasgungore/arasgungore-CV).
