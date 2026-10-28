import { readFileSync, writeFileSync } from 'node:fs';
import { parse } from 'opentype.js';
import { sampleClosedContour, type Point } from '../src/fourier/math';

// KaTeX's mathematical script M (mathscr M), not a handwritten imitation.
// Font: KaTeX_Script-Regular, SIL OFL; see public/licenses/KaTeX-FONTS.txt.
const bytes = readFileSync(new URL('../node_modules/katex/dist/fonts/KaTeX_Script-Regular.ttf', import.meta.url));
const font = parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const path = font.getPath('M', 0, 0, 350);
const bounds = path.getBoundingBox();
const offset = { x: 260 - (bounds.x1 + bounds.x2) / 2, y: 230 - (bounds.y1 + bounds.y2) / 2 };
const contours: Point[][] = [];
let contour: Point[] = [], cursor: Point = { x: 0, y: 0 };
for (const command of path.commands) {
  if (command.type === 'Z') {
    if (contour.length > 1) contours.push(contour);
    contour = [];
    continue;
  }
  const end = { x: command.x + offset.x, y: command.y + offset.y };
  if (command.type === 'M') {
    if (contour.length > 1) contours.push(contour);
    contour = [end];
  } else if (command.type === 'L') {
    contour.push(end);
  } else {
    const start = cursor;
    const c1 = { x: command.x1 + offset.x, y: command.y1 + offset.y };
    // Flatten the Bézier before resampling by arc length, not by parameter.
    for (let j = 1; j <= 32; j++) {
      const t = j / 32, u = 1 - t;
      if (command.type === 'Q') {
        contour.push({ x: u*u*start.x + 2*u*t*c1.x + t*t*end.x, y: u*u*start.y + 2*u*t*c1.y + t*t*end.y });
      } else if (command.type === 'C') {
        const c2 = { x: command.x2 + offset.x, y: command.y2 + offset.y };
        contour.push({ x: u**3*start.x + 3*u*u*t*c1.x + 3*u*t*t*c2.x + t**3*end.x, y: u**3*start.y + 3*u*u*t*c1.y + 3*u*t*t*c2.y + t**3*end.y });
      }
    }
  }
  cursor = end;
}
if (contour.length > 1) contours.push(contour);
if (!contours.length) throw new Error('Font did not yield any contours');
const samples = contours.map(c => sampleClosedContour(c, 512).map(p => ({ x: +p.x.toFixed(5), y: +p.y.toFixed(5) })));
writeFileSync(new URL('../src/fourier/glyph.json', import.meta.url), JSON.stringify({ source: 'KaTeX Script Regular, mathematical script M', contours: samples }) + '\n');
console.log(`Generated ${samples.length} independent contours, 512 samples each.`);
