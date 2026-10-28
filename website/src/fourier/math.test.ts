import { describe, expect, test } from 'bun:test';
import { transform, reconstruct, sampleClosedContour } from './math';
import glyph from './glyph.json';

describe('complex Fourier reconstruction', () => {
  test('recovers translation, phase, radius, and signed frequency', () => {
    for (const k of [-3, 1, 5]) {
      const points = Array.from({ length: 64 }, (_, j) => ({ x: 13 + 4 * Math.cos(2*Math.PI*k*j/64 + .7), y: -8 + 4 * Math.sin(2*Math.PI*k*j/64 + .7) }));
      const cs = transform(points);
      expect(cs[0]!.frequency).toBe(0);
      expect(cs[0]!.re).toBeCloseTo(13, 10);
      expect(cs[0]!.im).toBeCloseTo(-8, 10);
      expect(cs[1]!.frequency).toBe(k);
      expect(cs[1]!.amplitude).toBeCloseTo(4, 10);
      points.forEach((p,j) => {
        const r = reconstruct(cs.slice(0,2),j/64);
        expect(r.x).toBeCloseTo(p.x, 9); expect(r.y).toBeCloseTo(p.y, 9);
      });
    }
  });
  test('resamples a closed path uniformly and excludes duplicate endpoint', () => {
    const samples = sampleClosedContour([{x:0,y:0},{x:2,y:0},{x:2,y:2},{x:0,y:2}],8);
    expect(samples).toEqual([{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:2,y:1},{x:2,y:2},{x:1,y:2},{x:0,y:2},{x:0,y:1}]);
    expect(() => sampleClosedContour([{x:0,y:0},{x:0,y:0}],8)).toThrow();
  });
  test('full glyph transform reconstructs original samples and closes periodically', () => {
    expect(glyph.contours.length).toBeGreaterThan(0);
    for (const contour of glyph.contours) {
      const cs = transform(contour);
      contour.forEach((p,j) => {
        const r = reconstruct(cs,j/contour.length);
        expect(r.x).toBeCloseTo(p.x,7); expect(r.y).toBeCloseTo(p.y,7);
      });
      const a = reconstruct(cs,0), b = reconstruct(cs,1);
      expect(a.x).toBeCloseTo(b.x,8); expect(a.y).toBeCloseTo(b.y,8);
    }
  });
  test('adding harmonics reduces glyph sample error', () => {
    const points = glyph.contours[0]!, cs = transform(points);
    const error = (n: number) => points.reduce((sum,p,j) => { const r = reconstruct(cs.slice(0,n),j/points.length);return sum + (r.x-p.x)**2+(r.y-p.y)**2; },0)/points.length;
    expect(error(128)).toBeLessThan(error(64));
    expect(error(64)).toBeLessThan(error(24));
    // Error is below the 2-unit trace width in the 520-unit canvas.
    expect(Math.sqrt(error(64))).toBeLessThan(2);
    expect(Math.sqrt(error(128))).toBeLessThan(1);
  });
  test('separate contours retain their own centers without bridge segments', () => {
    const a = transform([{x:1,y:1},{x:2,y:1},{x:2,y:2},{x:1,y:2}]);
    const b = transform([{x:10,y:10},{x:11,y:10},{x:11,y:11},{x:10,y:11}]);
    expect(a[0]!.re).toBe(1.5); expect(b[0]!.re).toBe(10.5);
  });
});
