(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const root = document.documentElement;
  const hero = $('.hero-track'), frame = $('.hero-frame'), sculpture = $('.sculpture');
  const roles = $$('.hero-role'), field = $('.color-field');
  const manifesto = $('.manifesto'), marquee = $('.marquee > span');
  const work = $('.selected-work'), cards = $$('.card-position');
  const about = $('.about'), chapters = $$('.about-chapter');
  const header = $('.header'), footer = $('footer');
  const wave = $('.wave-track'), waveChars = $$('.wave-char');
  const seed = $('.wave-seed');
  const toolkit = $('.toolkit'), toolkitPin = $('.toolkit-pin'), toolItems = $$('.tool-brand'), toolHeading = $('.toolkit-heading'), toolOrbits = $('.toolkit-orbits'), toolCategories = $('.toolkit-categories');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const letters = chapters.map(chapter => Array.from(chapter.querySelectorAll('.chapter-char')));
  const fronts = cards.map(card => card.querySelector('.card-front'));
  const backs = cards.map(card => card.querySelector('.card-back'));
  let enabled = false, height = window.innerHeight, width = window.innerWidth;
  let heroTop = 0, workTop = 0, manifestoTop = 0, aboutTop = 0, waveTop = 0, toolkitTop = 0, footerTop = 0;
  let target = window.scrollY, position = target, raf = 0;
  let pointerX = 0, pointerY = 0, mouseX = 0, mouseY = 0;
  let hovered = -1, flipped = -1;
  const lifts = cards.map(() => 0);
  const foil = cards.map(() => ({ x: 0, y: 0, targetX: 0, targetY: 0 }));
  let gradientMetrics = [], waveMetrics = [], waveWidth = 0, waveSize = 0, toolkitHeight = height;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const n = clamp((v - a) / (b - a)); return n * n * (3 - 2 * n); };
  const point = element => element.getBoundingClientRect().top + window.scrollY;
  function measure() {
    height = window.innerHeight; width = window.innerWidth;
    heroTop = point(hero); workTop = point(work); manifestoTop = point(manifesto); aboutTop = point(about); footerTop = point(footer); waveTop = point(wave); toolkitTop = point(toolkit);
    toolkitHeight = toolkitPin.clientHeight || height;
    const glyphWidths = waveChars.map(char => char.offsetWidth || width * .07);
    waveWidth = glyphWidths.reduce((sum, value) => sum + value, 0);
    waveSize = waveChars[0].offsetHeight || width * .15;
    let cursor = 0;
    waveMetrics = glyphWidths.map(glyphWidth => { const x = cursor + glyphWidth / 2; cursor += glyphWidth; return { x, width: glyphWidth }; });
    gradientMetrics = letters[2].map(letter => ({ left: letter.offsetLeft + letter.parentElement.offsetLeft, width: letter.parentElement.parentElement.clientWidth || width }));
  }
  function flipCard(i, open, focus = true) {
    if (open && flipped !== -1 && flipped !== i) flipCard(flipped, false, false);
    cards[i].classList.toggle('is-flipped', open);
    fronts[i].setAttribute('aria-expanded', String(open));
    fronts[i].setAttribute('aria-hidden', String(open));
    fronts[i].inert = open;
    backs[i].inert = !open;
    backs[i].setAttribute('aria-hidden', String(!open));
    flipped = open ? i : flipped === i ? -1 : flipped;
    if (focus) (open ? backs[i].querySelector('.card-close') : fronts[i]).focus({ preventScroll: true });
    request();
  }
  function render() {
    header.classList.toggle('on-dark', position > manifestoTop - height * .12 && position < waveTop + height * 3.4);
    if (!enabled) {
      letters[2].forEach((letter, n) => {
        const metric = gradientMetrics[n];
        letter.style.backgroundSize = `${metric.width * 3}px 100%`;
        letter.style.backgroundPosition = `${-metric.left - metric.width * .9}px 50%`;
      });
      return;
    }
    renderWave();
    renderToolkit();
    const progress = clamp((position - heroTop) / (height * .8));
    frame.style.transform = `scale(${1 - progress * .13})`;
    frame.style.borderRadius = `${18 + progress * 32}px`;
    roles[0].style.transform = `translate(${progress * 12}vw,${-progress * 14}vh)`;
    roles[1].style.transform = `translate(${-progress * 12}vw,${progress * 13}vh)`;
    sculpture.style.transform = `translate(-50%,-50%) rotateX(${-14 + mouseY * 10 + progress * 55}deg) rotateY(${-24 + mouseX * 22 + progress * 80}deg) rotateZ(${-13 + mouseX * 4 - progress * 32}deg) scale(${1 - progress * .2})`;
    field.style.setProperty('--gx', `${mouseX * 30}px`);
    field.style.setProperty('--gy', `${mouseY * 20}px`);
    const mp = clamp((position - manifestoTop + height * .6) / (height * 1.65));
    marquee.style.transform = `translateX(${8 - mp * 92}vw)`;


    const t = (position - workTop) / height;
    const spread = smooth(-.05, .75, t);
    const mobile = width <= 700;
    cards.forEach((card, i) => {
      const distance = Math.abs(i - 2);
      const enter = smooth(-.45 + distance * .04, .55 + distance * .04, t);
      const x = (i - 2) * Math.min(width * .168, 290) * spread;
      const y = (1 - enter) * height * 1.1 + distance * distance * height * .012 * spread - lifts[i] * height * .04;
      const rotation = (i - 2) * 5.5 * spread * (1 - lifts[i] * .85);
      const light = foil[i];
      card.style.setProperty('--foil-x', `${50 + light.x * 35 + Math.sin(t * .8 + i) * 9}%`);
      card.style.setProperty('--foil-y', `${50 + light.y * 30}%`);
      card.style.setProperty('--glare-x', `${40 + light.x * 30}%`);
      card.style.setProperty('--glare-y', `${30 + light.y * 25}%`);
      card.style.setProperty('--glare-strength', String(.32 + lifts[i] * .3));
      card.style.transform = mobile ? `translateY(${(1 - enter) * 70 - lifts[i] * 5}px)` : `translate(-50%,-50%) translate3d(${x}px,${y}px,0) rotateX(${(1 - enter) * 35 - light.y * 2}deg) rotateY(${light.x * 4}deg) rotateZ(${rotation}deg) scale(${.94 + enter * .06})`;
      card.style.zIndex = String(flipped === i ? 30 : hovered === i ? 20 : 5 + i);
    });
    const journey = (position - aboutTop) / height;
    chapters.forEach((chapter, i) => {
      const local = journey - .3 - i * 1.45;
      const enter = smooth(-.62, .28, local);
      const exit = i === chapters.length - 1 ? 0 : smooth(.88, 1.68, local);
      const y = (1 - enter) * 110 - exit * 135;
      chapter.style.transform = `translateY(calc(-50% + ${y}vh))`;
      // The words travel into view at full opacity, then leave upward.
      chapter.style.visibility = local < -.75 || local > 1.95 && i < 2 ? 'hidden' : 'visible';
      const active = clamp(Math.floor((journey - .3 + .55) / 1.45), 0, 2);
      chapter.setAttribute('aria-hidden', String(i !== active || journey < -.2));
      letters[i].forEach((letter, n) => {
        const settle = smooth(-.35 + n * .018, .22 + n * .018, local);
        const depart = i === 2 ? 0 : smooth(.95 + n * .012, 1.55 + n * .012, local);
        const wave = (1 - settle) * Math.pow(n, 1.06) * 2.8 + depart * Math.pow(n, 1.04) * -1.8;
        letter.style.transform = `translateY(${wave}vh)`;
        if (i === 2) {
          const metric = gradientMetrics[n];
          const sweep = smooth(.25, 1.3, local);
          letter.style.backgroundSize = `${metric.width * 3}px 100%`;
          letter.style.backgroundPosition = `${-metric.left - metric.width * sweep * 1.35}px 50%`;
        }
      });
    });
  }
  function renderToolkit() {
    const journey = (position - toolkitTop) / toolkitHeight;
    const arrive = smooth(-.45, .45, journey);
    const spin = smooth(-.3, 1.85, journey) * Math.PI * 2.5;
    const unfold = smooth(1.55, 2.7, journey);
    const mobile = width <= 700;
    const radius = Math.min(width * (mobile ? .3 : .34), 530);
    const depth = Math.min(width * .17, 280);
    toolItems.forEach((item, i) => {
      const angle = i / toolItems.length * Math.PI * 2 + spin;
      const orbitX = Math.cos(angle) * radius * (1.3 - arrive * .3);
      const orbitY = ((i - 5.5) * toolkitHeight * .052 + Math.sin(angle) * toolkitHeight * .075) * .72 + toolkitHeight * .07 + (1 - arrive) * toolkitHeight * .72;
      const orbitZ = Math.sin(angle) * depth;
      const lane = i < 5 ? 0 : i < 9 ? 1 : 2;
      const row = i < 5 ? i : i < 9 ? i - 5 : i - 9;
      const flatX = mobile ? (i % 2 ? 1 : -1) * width * .235 : (lane - 1) * width * .28;
      const flatY = mobile ? toolkitHeight * (-.16 + Math.floor(i / 2) * .09) : toolkitHeight * (-.12 + row * .102);
      const x = orbitX + (flatX - orbitX) * unfold;
      const y = orbitY + (flatY - orbitY) * unfold;
      const z = orbitZ * (1 - unfold);
      const scale = 1 + (1 - unfold) * (.16 + Math.sin(angle) * .12);
      item.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,${z}px) rotateZ(${(1 - unfold) * Math.cos(angle) * -7}deg) scale(${scale})`;
      item.style.zIndex = String(Math.round(z + depth + 5));
    });
    // Keep the smaller heading above the orbit throughout the sequence.
    toolOrbits.style.transform = `rotate(${spin * 10}deg) scale(${1 - unfold * .25})`;
    toolOrbits.style.opacity = String((1 - unfold) * arrive);
    const labels = smooth(2.3, 2.7, journey);
    toolCategories.style.clipPath = `inset(${(1 - labels) * 100}% 0 0)`;
    toolCategories.style.transform = `translateY(${(1 - labels) * 18}px)`;
  }
  function renderWave() {
    // A single line travels along a changing curve; its full stop reveals contact.
    const journey = (position - waveTop) / height;
    const travel = smooth(-.1, 1.9, journey);
    const bend = smooth(.2, 1.35, journey);
    const depart = smooth(1.9, 2.45, journey);
    const entry = (1 - smooth(-.6, -.02, journey)) * height * .65;
    const shift = width * .3 + travel * (waveWidth - width * .3);
    const curve = x => {
      const u = (x - width * .5) / width;
      return height * (.48 + u * u * .62 - (1 - bend) * u * .9) + entry;
    };
    waveChars.forEach((char, i) => {
      const x = width * .5 + waveMetrics[i].x - shift;
      const u = (x - width * .5) / width;
      const y = curve(x);
      const angle = Math.atan(height / width * (u * 1.24 - (1 - bend) * .9)) * 180 / Math.PI;
      char.style.transform = `translate(-50%,-50%) translate3d(${x - depart * width * .65}px,${y - depart * height * .95}px,0) rotate(${angle - depart * 18}deg)`;
      // A continuous gradient follows the entire sentence rather than each glyph.
      char.style.setProperty('--word-colour', String(smooth(.55, 1.15, journey)));
      char.style.backgroundSize = `${waveWidth}px 100%`;
      char.style.backgroundPosition = `${-waveMetrics[i].x + waveMetrics[i].width / 2}px 50%`;
    });
    const dotSize = Math.max(12, waveSize * .11);
    const dotX = width * .5 + waveWidth + dotSize * .7 - shift;
    const fall = smooth(1.88, 2.45, journey);
    const x = dotX + (width * .5 - dotX) * fall;
    const y = curve(dotX) + (height * .78 - curve(dotX)) * fall;
    seed.style.width = seed.style.height = `${dotSize}px`;
    seed.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,0)`;
    const reveal = smooth(2.42, 3.15, journey);
    const radius = Math.hypot(width * .5, height * .78) * 1.06 * reveal;
    footer.style.clipPath = `circle(${radius}px at 50% 78%)`;
    footer.inert = reveal < .5;
    footer.setAttribute('aria-hidden', String(reveal < .5));
    if (reveal > .75) header.classList.remove('on-dark');
  }
  function tick() {
    position += (target - position) * .16;
    mouseX += (pointerX - mouseX) * .09;
    mouseY += (pointerY - mouseY) * .09;
    let lifting = false;
    foil.forEach(light => {
      light.x += (light.targetX - light.x) * .14;
      light.y += (light.targetY - light.y) * .14;
      if (Math.abs(light.targetX - light.x) > .002 || Math.abs(light.targetY - light.y) > .002) lifting = true;
    });
    lifts.forEach((value, i) => {
      const goal = flipped === i ? 1 : hovered === i ? .65 : 0;
      lifts[i] += (goal - value) * .14;
      if (Math.abs(goal - lifts[i]) < .002) lifts[i] = goal;
      else lifting = true;
    });
    if (Math.abs(target - position) < .15) position = target;
    render();
    if (enabled && (Math.abs(target - position) > .15 || Math.abs(pointerX - mouseX) > .002 || Math.abs(pointerY - mouseY) > .002 || lifting)) raf = requestAnimationFrame(tick);
    else raf = 0;
  }
  function request() { if (!raf) raf = requestAnimationFrame(tick); }
  function reset() {
    [frame, sculpture, ...roles, marquee, ...cards, ...chapters, ...letters.flat(), ...waveChars, seed, footer, ...toolItems, toolHeading, toolOrbits, toolCategories].forEach(el => el.removeAttribute('style'));
    chapters.forEach(chapter => chapter.removeAttribute('aria-hidden'));
    footer.inert = false; footer.removeAttribute('aria-hidden');
    header.classList.remove('on-dark');
  }
  function setMode() {
    enabled = !preference.matches;
    root.classList.toggle('motion', enabled);
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (!enabled) reset();
    measure(); target = position = window.scrollY; render(); request();
  }
  cards.forEach((card, i) => {
    fronts[i].addEventListener('click', () => flipCard(i, true));
    backs[i].querySelector('.card-close').addEventListener('click', () => flipCard(i, false));
    backs[i].addEventListener('click', event => { if (!event.target.closest('a,button')) flipCard(i, false); });
    card.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { hovered = i; request(); } });
    card.addEventListener('pointermove', event => {
      if (!enabled || event.pointerType === 'touch') return;
      const box = card.getBoundingClientRect();
      foil[i].targetX = clamp((event.clientX - box.left) / box.width) * 2 - 1;
      foil[i].targetY = clamp((event.clientY - box.top) / box.height) * 2 - 1;
      request();
    }, { passive: true });
    card.addEventListener('pointerleave', () => { hovered = -1; foil[i].targetX = foil[i].targetY = 0; request(); });
    card.addEventListener('focusin', () => { hovered = i; request(); });
    card.addEventListener('focusout', event => { if (!card.contains(event.relatedTarget)) { hovered = -1; request(); } });
    backs[i].inert = true;
    backs[i].setAttribute('aria-hidden', 'true');
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && flipped !== -1) flipCard(flipped, false); });
  window.addEventListener('scroll', () => { target = window.scrollY; if (!enabled) position = target; request(); }, { passive: true });
  window.addEventListener('resize', () => { measure(); target = window.scrollY; request(); }, { passive: true });
  frame.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const box = frame.getBoundingClientRect();
    pointerX = clamp((event.clientX - box.left) / box.width, 0, 1) * 2 - 1;
    pointerY = clamp((event.clientY - box.top) / box.height, 0, 1) * 2 - 1;
    request();
  }, { passive: true });
  frame.addEventListener('pointerleave', () => { pointerX = pointerY = 0; request(); });
  preference.addEventListener('change', setMode);
  $('#year').textContent = new Date().getFullYear();
  measure(); setMode();
  document.fonts?.ready.then(() => { measure(); request(); });
  function goToContact() {
    if (enabled && window.location.hash === '#contact') {
      window.scrollTo({ top: waveTop + height * 3.2, behavior: 'instant' });
      target = position = window.scrollY; render(); request();
    }
  }
  window.addEventListener('hashchange', goToContact);
  window.addEventListener('load', () => { measure(); goToContact(); request(); });
})();
