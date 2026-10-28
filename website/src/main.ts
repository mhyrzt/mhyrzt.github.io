import { mountFourier } from './fourier/renderer';
import { mountScrollMotion } from './scroll';

const disposeScroll = mountScrollMotion();
if (import.meta.hot) import.meta.hot.dispose(disposeScroll);

async function showCvReleaseDate() {
  const label = document.querySelector<HTMLElement>('#cv-updated');
  const time = label?.querySelector('time');
  if (!label || !time) return;
  try {
    const response = await fetch('https://api.github.com/repos/mhyrzt/mhyrzt.github.io/releases/latest', {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return;
    const release: { published_at?: unknown } = await response.json();
    if (typeof release.published_at !== 'string') return;
    const date = new Date(release.published_at);
    if (!Number.isFinite(date.getTime())) return;
    time.dateTime = date.toISOString();
    time.textContent = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
    }).format(date);
    label.hidden = false;
  } catch { /* The CV download stays available if release metadata cannot load. */ }
}
void showCvReleaseDate();

const theme = document.querySelector<HTMLButtonElement>('#theme');
function updateThemeButton() {
  if (!theme) return;
  const light = document.documentElement.dataset.webtuiTheme === 'light';
  theme.textContent = light ? 'Dark ↗' : 'Light ↗';
  theme.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#e1e2e7' : '#1a1b26');
}
if (theme) {
  theme.hidden = false;
  updateThemeButton();
  theme.addEventListener('click', () => {
    const next = document.documentElement.dataset.webtuiTheme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.webtuiTheme = next;
    try { localStorage.setItem('theme', next); } catch { /* Storage is optional. */ }
    updateThemeButton();
  });
}

const figure = document.querySelector<HTMLElement>('.fourier');
if (figure) {
  try {
    const dispose = mountFourier(figure);
    if (import.meta.hot) import.meta.hot.dispose(dispose);
  } catch {
    // Keep the real SVG outline available if Canvas or observation APIs fail.
    figure.querySelector('canvas')?.setAttribute('hidden', '');
    figure.querySelector<SVGElement>('.glyph-fallback')?.style.removeProperty('display');
  }
}
