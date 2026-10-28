/** Enhance section entrances without intercepting wheel, touch, or anchor input.
 * Content stays visible before initialization and when JavaScript is disabled. */
export function mountScrollMotion(): () => void {
  if (!('IntersectionObserver' in window) || !('animate' in Element.prototype)) return () => {};
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const sections = [...document.querySelectorAll<HTMLElement>('main > .section')];
  const seen = new WeakSet<Element>();
  const animations = new Set<Animation>();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (preference.matches || seen.has(entry.target)) continue;
      seen.add(entry.target);
      // Translation alone preserves text contrast throughout the entrance.
      const animation = entry.target.animate(
        [{ transform: 'translateY(1lh)' }, { transform: 'translateY(0)' }],
        { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
      animations.add(animation);
      animation.finished.catch(() => {}).finally(() => animations.delete(animation));
    }
  }, { rootMargin: '0px 0px -24px 0px', threshold: 0 });

  function sync() {
    observer.disconnect();
    for (const animation of animations) animation.cancel();
    animations.clear();
    if (!preference.matches) {
      for (const section of sections) if (!seen.has(section)) observer.observe(section);
    }
  }
  preference.addEventListener('change', sync);
  sync();
  return () => {
    observer.disconnect();
    preference.removeEventListener('change', sync);
    for (const animation of animations) animation.cancel();
    animations.clear();
  };
}
