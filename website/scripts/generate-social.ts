import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import glyph from '../src/fourier/glyph.json';
import { transform, vector } from '../src/fourier/math';

const font = readFileSync(new URL('../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2',import.meta.url)).toString('base64');
const outline = glyph.contours.map(c => `M${c.map(p=>`${p.x+590},${p.y+80}`).join('L')}Z`).join('');
let construction = '';
for (const contour of glyph.contours) {
  let x=590,y=80;
  for (const c of transform(contour).slice(0,24)) {
    const v=vector(c,.72);
    if(c.frequency !== 0) construction += `<circle cx="${x}" cy="${y}" r="${c.amplitude}"/><path d="M${x},${y}l${v.x},${v.y}"/>`;
    x+=v.x;y+=v.y;
  }
}
const browser = await chromium.launch();
try {
  const page = await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
  await page.setContent(`<style>@font-face{font-family:Plex;src:url(data:font/woff2;base64,${font})}body{margin:0}</style><svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" style="font-family:Plex,monospace"><rect width="1200" height="630" fill="#1a1b26"/><path d="M65 85H1135" stroke="#414868"/><g fill="#7dcfff" font-size="20"><text x="65" y="56">mhyrzt / personal space</text></g><g fill="#c0caf5" font-size="80"><text x="65" y="245">Mahyar</text><text x="65" y="340">Riazati.</text></g><g fill="#a9b1d6" font-size="23"><text x="65" y="425">Software. Infrastructure.</text><text x="65" y="470">Reinforcement learning.</text></g><text x="65" y="575" fill="#a9b1d6" font-size="19">mhyrzt.github.io</text><g fill="none" stroke="#737aa2" stroke-width="1" opacity=".45">${construction}</g><path d="${outline}" fill="none" stroke="#7dcfff" stroke-width="2.5"/></svg>`);
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:new URL('../public/social.png',import.meta.url).pathname});
} finally { await browser.close(); }
