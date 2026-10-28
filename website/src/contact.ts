import { identity } from './content';

export function mountContact(): void {
  const button = document.querySelector<HTMLButtonElement>('#copy-email');
  const status = document.querySelector<HTMLElement>('#contact-status');
  if (!button || !status || !navigator.clipboard?.writeText) return;
  button.hidden = false;
  button.addEventListener('click', async () => {
    // Solve only on request; never place the result in HTML, a URL, or metadata.
    const consonants = identity.name.toLowerCase().replace(/[^a-z]/g, '').replace(/[aeiou]/g, '');
    const handle = [...new Set(consonants)].join('');
    try {
      await navigator.clipboard.writeText(`${handle}@${['gmail', 'com'].join('.')}`);
      status.textContent = 'Puzzle solved. Email copied. ツ';
    } catch {
      status.textContent = 'Clipboard unavailable. The puzzle still works by hand. ツ';
    }
  });
}
