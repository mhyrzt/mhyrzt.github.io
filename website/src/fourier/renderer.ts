import glyph from './glyph.json';
import { transform, reconstruct, vector, type Coefficient, type Point } from './math';

interface Curve { coefficients: Coefficient[]; trace: Point[] }
const WIDTH = 520, HEIGHT = 460, TRACE_STEPS = 1200, PERIOD = 18000;

export function mountFourier(container: HTMLElement): () => void {
  const canvas = container.querySelector<HTMLCanvasElement>('canvas');
  const context = canvas?.getContext('2d');
  const fallback = container.querySelector<SVGElement>('.glyph-fallback');
  if (!canvas || !context || !fallback) return () => {};
  const ctx = context, surface = canvas;
  const curves: Curve[] = glyph.contours.map(points => {
    const coefficients = transform(points).slice(0,128);
    return { coefficients, trace: Array.from({length:TRACE_STEPS+1},(_,j)=>reconstruct(coefficients,j/TRACE_STEPS)) };
  });
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let elapsed = PERIOD * .72, previous = 0, frame = 0;
  let visible = false;
  let colors = { accent: '', construction: '', paper: '' };

  function updateColors() {
    const style = getComputedStyle(container);
    colors = { accent: style.getPropertyValue('--accent').trim(), construction: style.getPropertyValue('--construction').trim(), paper: style.getPropertyValue('--foreground0').trim() };
    draw();
  }
  function line(points: readonly Point[], color: string, width: number) {
    if (!points.length) return;
    ctx.beginPath(); ctx.moveTo(points[0]!.x, points[0]!.y);
    points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
  }
  function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    const t = (elapsed % PERIOD) / PERIOD;
    curves.forEach(curve => {
      // A subdued full reconstruction keeps the glyph readable during every phase.
      ctx.globalAlpha = .18;
      line(curve.trace, colors.accent, 1.3);
      {
        let p: Point = { x: 0, y: 0 };
        curve.coefficients.forEach(c => {
          const v = vector(c, t), end = { x: p.x + v.x, y: p.y + v.y };
          if (c.frequency !== 0) {
            ctx.globalAlpha = .38;
            ctx.beginPath(); ctx.arc(p.x, p.y, c.amplitude, 0, Math.PI * 2);
            ctx.strokeStyle = colors.construction; ctx.lineWidth = .7; ctx.stroke();
            ctx.globalAlpha = .5;
            line([p, end], colors.construction, .8);
          }
          p = end;
        });
      }
      ctx.globalAlpha = 1;
      const head = reconstruct(curve.coefficients, t);
      line([...curve.trace.slice(0, Math.floor(t * TRACE_STEPS) + 1), head], colors.accent, 2);
      ctx.beginPath(); ctx.arc(head.x, head.y, 3, 0, Math.PI * 2); ctx.fillStyle = colors.paper; ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
  function tick(now: number) {
    if (previous) elapsed += Math.min(now - previous, 80);
    previous = now; draw(); frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); frame = 0; previous = 0;
    const reduced = motion.matches;
    surface.hidden = reduced; fallback!.style.display = reduced ? '' : 'none';
    container.dataset.animation = reduced ? 'reduced' : !visible || document.hidden ? 'suspended' : 'running';
    if (!reduced && visible && !document.hidden) frame = requestAnimationFrame(tick);
    draw();
  }
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 3);
    const width = surface.getBoundingClientRect().width || WIDTH;
    surface.width = Math.round(width * dpr); surface.height = Math.round(width * HEIGHT / WIDTH * dpr);
    ctx.setTransform(surface.width / WIDTH, 0, 0, surface.height / HEIGHT, 0, 0);
    draw();
  }
  const observer = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? false; sync(); }, { threshold: .05 });
  const resizeObserver = new ResizeObserver(resize);
  const themeObserver = new MutationObserver(updateColors);
  motion.addEventListener('change', sync); document.addEventListener('visibilitychange', sync);
  observer.observe(container); resizeObserver.observe(surface.parentElement!);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-webtui-theme'] });
  updateColors(); sync(); resize();
  return () => {
    cancelAnimationFrame(frame); observer.disconnect(); resizeObserver.disconnect(); themeObserver.disconnect();
    motion.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync);
  };
}
