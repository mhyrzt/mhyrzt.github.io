import { mountFourier } from './fourier/renderer';
import { cvProfiles, cvDownload } from './content';
import { mountScrollMotion } from './scroll';

const disposeScroll = mountScrollMotion();
if (import.meta.hot) import.meta.hot.dispose(disposeScroll);

const cvSelect = document.querySelector<HTMLSelectElement>('#cv-profile');
const cvLink = document.querySelector<HTMLAnchorElement>('#cv-download');
if (cvSelect && cvLink) {
  cvSelect.closest<HTMLElement>('.cv-picker')!.hidden = false;
  cvSelect.addEventListener('change', () => {
    const profile = cvProfiles.find(p => p.id === cvSelect.value);
    if (!profile) return;
    cvLink.href = cvDownload(profile.filename);
    cvLink.textContent = `↓ ${profile.label}`;
  });
}

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
