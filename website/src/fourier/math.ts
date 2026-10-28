export interface Point { x: number; y: number }
export interface Coefficient { frequency: number; re: number; im: number; amplitude: number }
const TAU = 2 * Math.PI;

/** Complex DFT, normalized so inverse reconstruction needs no further scaling.
 * Signed frequencies preserve counter-rotating vectors. DC is placed first,
 * then vectors are ordered by amplitude to keep the construction legible. */
export function transform(points: readonly Point[]): Coefficient[] {
  if (points.length === 0) return [];
  const n = points.length;
  return Array.from({ length: n }, (_, k) => {
    const frequency = k <= n / 2 ? k : k - n;
    let re = 0, im = 0;
    points.forEach((p, j) => {
      const angle = TAU * frequency * j / n;
      re += p.x * Math.cos(angle) + p.y * Math.sin(angle);
      im += p.y * Math.cos(angle) - p.x * Math.sin(angle);
    });
    return { frequency, re: re / n, im: im / n, amplitude: Math.hypot(re, im) / n };
  }).sort((a, b) => a.frequency === 0 ? -1 : b.frequency === 0 ? 1 : b.amplitude - a.amplitude);
}

export function vector(c: Coefficient, t: number): Point {
  const angle = TAU * c.frequency * t;
  return { x: c.re * Math.cos(angle) - c.im * Math.sin(angle), y: c.re * Math.sin(angle) + c.im * Math.cos(angle) };
}

export function reconstruct(coefficients: readonly Coefficient[], t: number): Point {
  return coefficients.reduce((p, c) => {
    const v = vector(c, t);
    return { x: p.x + v.x, y: p.y + v.y };
  }, { x: 0, y: 0 });
}

/** Equal arc-length samples on one closed contour; never joins separate strokes. */
export function sampleClosedContour(points: readonly Point[], count: number): Point[] {
  if (points.length < 2 || count < 2 || !Number.isInteger(count)) throw new Error('A contour and at least two samples are required');
  const first = points[0]!;
  const closed = [...points, first];
  const lengths = [0];
  for (let i = 1; i < closed.length; i++) {
    lengths.push(lengths[i - 1]! + Math.hypot(closed[i]!.x - closed[i - 1]!.x, closed[i]!.y - closed[i - 1]!.y));
  }
  const total = lengths.at(-1)!;
  if (!total) throw new Error('Contour must have nonzero length');
  let segment = 1;
  return Array.from({ length: count }, (_, j) => {
    const distance = total * j / count;
    while (segment < lengths.length - 1 && lengths[segment]! < distance) segment++;
    const a = closed[segment - 1]!, b = closed[segment]!;
    const span = lengths[segment]! - lengths[segment - 1]!;
    const t = span ? (distance - lengths[segment - 1]!) / span : 0;
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  });
}
