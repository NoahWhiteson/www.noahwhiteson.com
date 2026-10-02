(() => {
  'use strict';
  const root = document.documentElement, loader = document.querySelector('.intro');
  if (!loader) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const content = [document.querySelector('.header'), document.querySelector('main')];
  const ball = loader.querySelector('.intro-ball'), ink = ball.querySelector('span');
  const shadow = loader.querySelector('.intro-shadow'), impact = loader.querySelector('.intro-impact');
  const hole = loader.querySelector('.intro-hole');
  let finished = false, frame = 0, start, release, assetsReady = false;
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
  const fonts = document.fonts ? [document.fonts.load('900 1em Cabinet'), document.fonts.load('500 1em Cabinet'), document.fonts.load('400 1em Cabinet')] : [];
  Promise.allSettled(fonts).then(() => { assetsReady = true; });
  setTimeout(() => { assetsReady = true; }, 2500);
  // Each flight includes its own impact pause, so compression happens on the ground.
  const flights = [
    {at:0, air:460, hold:85, from:.19, to:.32, height:.78, drop:true},
    {at:545, air:640, hold:80, from:.32, to:.45, height:.28},
    {at:1265, air:440, hold:80, from:.45, to:.50, height:.12}
  ];
  const total = 1785;
  const ease = x => x < .5 ? 8*x*x*x*x : 1-Math.pow(-2*x+2,4)/2;
  const draw = now => {
    if (finished) return;
    if (start === undefined) start = now;
    const t = now-start, w = innerWidth, h = innerHeight;
    const size = Math.max(26,Math.min(w*.028,42)), floor=h*.72;
    const f = flights.find(f => t < f.at+f.air+f.hold) || flights[2];
    const local=t-f.at, u=Math.max(0,Math.min(1,local/f.air));
    const x=w*(f.from+(f.to-f.from)*u);
    const lift=f.height*h*(f.drop?1-u*u:4*u*(1-u));
    const inHold=local>=f.air && local<f.air+f.hold;
    const pressure=inHold?Math.sin(Math.PI*(local-f.air)/f.hold):0;
    const speed=f.drop?u:Math.abs(1-2*u);
    const stretch=lift>size?speed*.2:0;
    const sy=1-pressure*.32+stretch, sx=1/Math.sqrt(sy);
    // Keep the ball's lowest point on the floor while it compresses.
    const y=floor-lift+(1-sy)*size/2;
    ball.style.transform=`translate3d(${x-size/2}px,${y-size/2}px,0)`;
    ink.style.transform=`rotate(${lift>size?(f.to-f.from)*speed*65:0}deg) scale(${sx},${sy})`;
    const near=Math.max(0,1-lift/(h*.78));
    shadow.style.transform=`translate3d(${x-29}px,${floor+size/2+4}px,0) scaleX(${.3+near*.7})`;
    shadow.style.opacity=String(.02+near*.12);
    const hit=(local-f.air)/180;
    impact.style.transform=`translate3d(${x-31}px,${floor+size/2-3}px,0) scale(${1+Math.max(0,hit)*.8})`;
    impact.style.opacity=String(hit>=0&&hit<1?(1-hit)*.15:0);
    if (t>=total+140 && assetsReady && release===undefined) {
      release=now;
      loader.classList.add('intro-leaving');
    }
    if (release!==undefined) {
      const progress=Math.min(1,(now-release)/850);
      const radius=size/2+(Math.hypot(w*.5,h*.72)+size)*ease(progress);
      hole.setAttribute('r',String(radius));
      ball.style.opacity=String(1-Math.min(1,progress*5));
      if(progress===1){clean();return;}
    }
    frame=requestAnimationFrame(draw);
  };
  frame=requestAnimationFrame(draw);
  setTimeout(clean,4500);
})();
