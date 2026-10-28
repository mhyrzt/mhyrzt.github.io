"""Check PDF content, text order, fonts, bounds, and links using Poppler."""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path
import re
import subprocess
import xml.etree.ElementTree as ET


@dataclass(frozen=True)
class Profile:
    filename: str
    headings: tuple[str, ...]
    pages: int | None = None


PROFILES = (
    Profile("mahyar-riazati-cv", (
        "Professional Experience", "Selected Projects", "Research Experience",
        "Publications", "Education", "Technical Skills",
    ), 2),
    Profile("mahyar-riazati-research-cv", (
        "Research Experience", "Publications", "Education", "Selected Projects",
        "Professional Experience", "Technical Skills",
    ), 2),
    Profile("mahyar-riazati-master-cv", (
        "Professional Experience", "Research Experience", "Education",
        "Publications", "Technical Skills", "Projects",
    )),
)
ROOT = Path(__file__).resolve().parents[1]
BUILD = ROOT / "build"


def run(*args: str) -> str:
    return subprocess.check_output(args, text=True)


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


def check(profile: Profile) -> set[str]:
    pdf = BUILD / f"{profile.filename}.pdf"
    log = (BUILD / f"{profile.filename}.log").read_text()
    require(not re.search(r"Overfull|Underfull|LaTeX Warning|Package .* Warning", log),
            f"{pdf.name}: inspect LaTeX warnings")
    match = re.search(r"^Pages:\s+(\d+)", run("pdfinfo", str(pdf)), re.MULTILINE)
    require(match is not None, f"{pdf.name}: missing page count")
    pages = int(match.group(1)) if match else 0
    require(profile.pages is None or pages == profile.pages,
            f"{pdf.name}: expected {profile.pages} pages, got {pages}")
    for mode in ("-raw", "-layout"):
        text = " ".join(run("pdftotext", mode, str(pdf), "-").split())
        require(text.startswith("Mahyar Riazati"), f"{pdf.name}: name not first")
        positions = [text.find(heading) for heading in profile.headings]
        require(all(index >= 0 for index in positions) and positions == sorted(positions),
                f"{pdf.name}: wrong section order in {mode} extraction")
        for expected in ("SAFER", "1,000", "3,000", "1,500", "May 2026", "XRAT", "OGym"):
            require(expected in text, f"{pdf.name}: missing extracted text: {expected}")
        require("mhyrzt.me" not in text and "Selected Training" not in text,
                f"{pdf.name}: obsolete content")
    fonts = run("pdffonts", str(pdf)).splitlines()[2:]
    require(bool(fonts), f"{pdf.name}: no fonts")
    for font in fonts:
        fields = font.split()
        require(fields[-5] == "yes" and fields[-3] == "yes",
                f"{pdf.name}: font lacks embedding or Unicode mapping: {font}")
    bbox = ET.fromstring(run("pdftotext", "-bbox", str(pdf), "-"))
    ns = {"h": "http://www.w3.org/1999/xhtml"}
    for page in bbox.findall(".//h:page", ns):
        width, height = float(page.attrib["width"]), float(page.attrib["height"])
        for word in page.findall("h:word", ns):
            a = word.attrib
            require(0 <= float(a["xMin"]) <= float(a["xMax"]) <= width
                    and 0 <= float(a["yMin"]) <= float(a["yMax"]) <= height,
                    f"{pdf.name}: text extends outside page: {word.text}")
    links = {line.split()[-1] for line in run("pdfinfo", "-url", str(pdf)).splitlines()[1:]}
    require(bool(links) and all(link.startswith(("https://", "mailto:")) for link in links),
            f"{pdf.name}: missing or malformed link annotations")
    require("https://mhyrzt.github.io" in links, f"{pdf.name}: missing website link")
    require(not any("mhyrzt.me" in link for link in links), f"{pdf.name}: expired domain")
    print(f"{pdf.name}: {pages} pages; extraction, fonts, bounds, links, and log passed")
    return links


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--links", action="store_true", help="Verify GitHub repos via gh")
    args = parser.parse_args()
    links: set[str] = set()
    for profile in PROFILES:
        links.update(check(profile))
    if args.links:
        repos = sorted({link.removeprefix("https://github.com/") for link in links
                        if re.fullmatch(r"https://github\.com/[^/]+/[^/]+", link)})
        for repo in repos:
            run("gh", "repo", "view", repo, "--json", "url")
            print(f"GitHub repository verified: {repo}")


if __name__ == "__main__":
    main()
