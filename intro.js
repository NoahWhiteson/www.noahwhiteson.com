(() => {
  'use strict';
  const root = document.documentElement;
  const loader = document.querySelector('.intro');
  if (!loader) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const content = [document.querySelector('.header'), document.querySelector('main')];
  const ball = loader.querySelector('.intro-ball'), ink = ball.querySelector('span');
  const shadow = loader.querySelector('.intro-shadow'), impact = loader.querySelector('.intro-impact');
  const hole = loader.querySelector('.intro-hole');
  let finished = false, frame = 0, start, assetsReady = false;
  const clean = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(frame);
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
  const fonts = document.fonts ? [document.fonts.load('900 1em Cabinet'), document.fonts.load('400 1em Cabinet')] : [];
  Promise.allSettled(fonts).then(() => { assetsReady = true; });
  setTimeout(() => { assetsReady = true; }, 2700);
  // A fall, followed by three diminishing parabolic arcs. Each impact gets a short spring.
  const flights = [
    {at:0, duration:560, from:.22, to:.31, height:.44, drop:true},
    {at:560, duration:720, from:.31, to:.44, height:.30},
    {at:1280, duration:510, from:.44, to:.51, height:.14},
    {at:1790, duration:350, from:.51, to:.50, height:.055}
  ];
  const total = 2140;
  const draw = now => {
    if (finished) return;
    if (start === undefined) start = now;
    const t = now - start, w = innerWidth, h = innerHeight;
    const size = Math.max(30, Math.min(w * .032, 46)), floor = h * .68;
    const flight = flights.find(f => t < f.at + f.duration) || flights[3];
    const u = Math.max(0, Math.min(1, (t - flight.at) / flight.duration));
    const x = w * (flight.from + (flight.to - flight.from) * u);
    const lift = flight.height * h * (flight.drop ? 1-u*u : 4*u*(1-u));
    const y = floor - lift;
    const sinceHit = t - flight.at;
    const spring = !flight.drop && sinceHit < 110 ? Math.sin(Math.PI * sinceHit / 110) : 0;
    const settle = t >= total ? Math.max(0, 1-(t-total)/180) : 0;
    const speed = flight.drop ? u : Math.abs(1-2*u);
    const stretch = lift > size ? speed * .18 : 0;
    const squash = Math.max(spring, settle) * .34;
    ball.style.transform = `translate3d(${x-size/2}px,${y-size/2}px,0)`;
    ink.style.transform = `rotate(${lift > size ? (flight.to-flight.from)*speed*90 : 0}deg) scale(${1+squash-stretch*.5},${1-squash+stretch})`;
    const proximity = Math.max(0, 1-lift/(h*.44));
    shadow.style.transform = `translate3d(${x-32}px,${floor+size/2+5}px,0) scaleX(${.4+proximity*.6})`;
    shadow.style.opacity = String(.04+proximity*.15);
    const ripple = !flight.drop && sinceHit < 180 ? sinceHit/180 : t >= total ? (t-total)/180 : 2;
    impact.style.transform = `translate3d(${x-34}px,${floor+size/2-4}px,0) scale(${1+ripple*.8})`;
    impact.style.opacity = String(ripple < 1 ? (1-ripple)*.2 : 0);
    if (t >= total + 180 && assetsReady) {
      // The aperture begins exactly where the ball comes to rest.
      loader.style.setProperty('--seed-radius', `${size/2}px`);
      loader.getBoundingClientRect();
      loader.classList.add('intro-leaving');
      setTimeout(clean, 1050);
      return;
    }
    frame = requestAnimationFrame(draw);
  };
  frame = requestAnimationFrame(draw);
  setTimeout(clean, 4500);
})();
