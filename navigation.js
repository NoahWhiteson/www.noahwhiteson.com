(() => {
  if (typeof location !== 'undefined' && location.pathname?.endsWith('/index.html')) {
    history.replaceState(history.state, '', location.pathname.slice(0, -10) + location.search + location.hash);
  }
  const nav = document.querySelector('.header .nav-pill');
  const indicator = nav.querySelector('.nav-active');
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  let sections = {}, animation = 0, active = '', pending = 0;
  const top = selector => {const el=document.querySelector(selector);return el.getBoundingClientRect().top+scrollY;};
  function measure() {
    const h=innerHeight, motion=root.classList.contains('motion');
    const about=top('#about'), wave=top('.wave-track');
    sections={
      '#top':0,
      '#work':top('#work')+(motion?h*.8:-85),
      '#about':about+(motion?h*.5:-85),
      '#toolkit':motion?about+h*6.65:top('#toolkit')-85,
      '#contact':motion?wave+h*3.25:top('#contact')-85
    };
    active='';update();
  }
  function update() {
    pending=0;
    const y=scrollY+innerHeight*.2;
    const motion=root.classList.contains('motion');
    let selected='';
    if(y>=top('#work'))selected='#work';
    if(y>=top('#about'))selected='#about';
    if(y>=(motion?top('#about')+innerHeight*4.15:top('#toolkit')))selected='#toolkit';
    if(y>=(motion?top('.wave-track')+innerHeight*2.65:top('#contact')))selected='#contact';
    if(selected===active)return;
    active=selected;
    links.forEach(link=>{if(link.getAttribute('href')===selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    const link=links.find(link=>link.getAttribute('href')===selected);
    indicator.style.opacity=link?'1':'0';
    if(link){indicator.style.width=`${link.offsetWidth+20}px`;indicator.style.transform=`translateX(${link.offsetLeft-10}px)`;}
  }
  function stop() {if(animation)cancelAnimationFrame(animation);animation=0;}
  function go(hash, writeHistory=false) {
    if(!(hash in sections))return;
    stop();
    const start=scrollY, end=Math.max(0,Math.min(sections[hash],document.documentElement.scrollHeight-innerHeight));
    if(writeHistory&&location.hash!==hash)history.pushState(null,'',hash);
    if(reduce.matches){scrollTo({top:end,behavior:'instant'});return;}
    const duration=Math.min(1800,Math.max(750,Math.abs(end-start)*.08+650));
    let started;
    function step(now){if(started===undefined)started=now;const t=Math.min(1,(now-started)/duration);const ease=(1-Math.cos(t*Math.PI))/2;scrollTo({top:start+(end-start)*ease,behavior:'instant'});if(t<1)animation=requestAnimationFrame(step);else animation=0;}
    animation=requestAnimationFrame(step);
  }
  document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
    const hash=link.getAttribute('href');if(!(hash in sections)||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    event.preventDefault();go(hash,true);
  }));
  addEventListener('scroll',()=>{if(!pending)pending=requestAnimationFrame(update);},{passive:true});
  ['wheel','touchstart','pointerdown'].forEach(event=>addEventListener(event,stop,{passive:true}));
  addEventListener('keydown',event=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key))stop();});
  addEventListener('resize',()=>{stop();measure();},{passive:true});
  addEventListener('popstate',()=>go(location.hash||'#top'));
  addEventListener('hashchange',()=>go(location.hash||'#top'));
  reduce.addEventListener('change',()=>{stop();measure();});
  document.fonts.ready.then(measure);
  addEventListener('load',()=>{measure();if(location.hash in sections)go(location.hash);});
  measure();
})();
