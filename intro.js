(() => {
  'use strict';
  const root = document.documentElement;
  const loader = document.querySelector('.intro');
  if (!loader) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const content = [document.querySelector('.header'), document.querySelector('main')];
  let finished = false;
  const clean = () => {
    if (finished) return;
    finished = true;
    root.classList.remove('intro-active');
    content.forEach(el => { if (el) el.inert = false; });
    loader.remove();
    preference.removeEventListener('change', clean);
    window.removeEventListener('pagehide', clean);
  };
  if (!root.classList.contains('intro-active') || preference.matches || location.hash || scrollY > 20) { clean(); return; }
  content.forEach(el => { if (el) el.inert = true; });
  preference.addEventListener('change', clean);
  window.addEventListener('pagehide', clean, { once: true });
  // Only the opening scene's fonts gate the reveal; other assets load normally.
  const fonts = document.fonts ? [document.fonts.load('900 1em Cabinet'), document.fonts.load('400 1em Cabinet')] : [];
  let ready = 0;
  const tasks = fonts.map(p => Promise.resolve(p).catch(() => {}).then(() => {
    ready++;
    loader.style.setProperty('--load', String(ready / fonts.length));
  }));
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  Promise.all([wait(1450), Promise.race([Promise.all(tasks), wait(2700)])]).then(() => {
    if (finished) return;
    loader.style.setProperty('--load', '1');
    loader.classList.add('intro-leaving');
    setTimeout(clean, 1050);
  });
  // Even a failed font request or animation must never leave an overlay behind.
  setTimeout(clean, 4200);
})();
