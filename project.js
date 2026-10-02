(() => {
  const root = document.documentElement;
  const journey = document.querySelector('.project-journey');
  const track = document.querySelector('.project-track');
    const media = [...document.querySelectorAll('.media-motion')];
  const progress = document.querySelector('.journey-progress span');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 761px)');
  let horizontal = false, travel = 0, current = 0, target = 0, frame = 0, top = 0;
  let measurements = [];
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  function measure() {
    horizontal = desktop.matches && !reduced.matches;
    root.classList.toggle('horizontal', horizontal);
    track.style.transform = '';
    media.forEach(el => el.style.transform = '');
    top = journey.getBoundingClientRect().top + scrollY;
    travel = horizontal ? Math.max(0, track.scrollWidth - innerWidth) : 0;
    root.style.setProperty('--travel', `${travel}px`);
    measurements = media.map(el => ({el, x:el.closest('.panel').offsetLeft + el.offsetLeft, width:el.offsetWidth}));
    current = target = horizontal ? clamp(scrollY - top, 0, travel) : 0;
    render();
    request();
  }
  function render() {
    if (!horizontal) {track.style.transform = '';progress.style.transform = 'scaleX(0)';return;}
    track.style.transform = `translate3d(${-current}px,0,0)`;
    progress.style.transform = `scaleX(${travel ? current / travel : 0})`;
    measurements.forEach(({el,x,width}) => {
      const distance = clamp((x + width / 2 - current - innerWidth / 2) / innerWidth, -1.5, 1.5);
      const scale = 1 - Math.min(.13, Math.abs(distance) * .105);
      const shift = distance * 32;
      el.style.transform = `translate3d(${shift}px,0,0) scale(${scale})`;
    });
  }
  function tick() {
    frame = 0;
    target = horizontal ? clamp(scrollY - top, 0, travel) : 0;
    current += (target - current) * .115;
    if (Math.abs(target-current) < .1) current = target;
    render();
    if (Math.abs(target-current) > .1) request();
  }
  function request() {if (!frame) frame = requestAnimationFrame(tick);}
  addEventListener('scroll', request, {passive:true});
  addEventListener('resize', measure, {passive:true});
  reduced.addEventListener('change', measure);
  desktop.addEventListener('change', measure);
  document.fonts.ready.then(measure);
  document.querySelectorAll('img').forEach(img => {if (!img.complete) img.addEventListener('load',measure,{once:true});});
  function goToPanel(panel) {
    scrollTo({top:horizontal ? top+panel.offsetLeft : panel.getBoundingClientRect().top+scrollY-85, behavior:reduced.matches?'instant':'smooth'});
  }
  document.querySelectorAll('a[href="#overview"]').forEach(link => link.addEventListener('click', event => {event.preventDefault();goToPanel(document.getElementById('overview'));}));
  // Keyboard focus moves the ribbon to the link's panel before it is used.
  track.addEventListener('focusin', event => {
    if (!horizontal) return;
    document.querySelector('.journey-window').scrollLeft = 0;
    const panel = event.target.closest('.panel');
    if (!panel) return;
    const left = panel.offsetLeft, right = left + panel.offsetWidth;
    if (left < current-40 || right > current+innerWidth+40) {
      const position = clamp(left,0,travel);
      scrollTo({top:top+position,behavior:'instant'});current=position;render();
    }
  });
  measure();
})();
