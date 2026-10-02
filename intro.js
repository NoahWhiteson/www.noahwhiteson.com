(() => {
  'use strict';
  const root=document.documentElement, loader=document.querySelector('.intro');
  if(!loader)return;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const content=[document.querySelector('.header'),document.querySelector('main')];
  const windowType=loader.querySelector('.intro-window'), paper=loader.querySelector('.intro-paper');
  let finished=false,frame=0,start,release,ready=false;
  const clean=()=>{
    if(finished)return;
    finished=true;cancelAnimationFrame(frame);
    root.classList.remove('intro-active');
    content.forEach(el=>{if(el)el.inert=false});
    loader.remove();preference.removeEventListener('change',clean);window.removeEventListener('pagehide',clean);
  };
  if(!root.classList.contains('intro-active')||preference.matches||location.hash||scrollY>20){clean();return;}
  content.forEach(el=>{if(el)el.inert=true});
  preference.addEventListener('change',clean);window.addEventListener('pagehide',clean,{once:true});
  const fonts=document.fonts?[document.fonts.load('900 1em Cabinet'),document.fonts.load('400 1em Cabinet')]:[];
  let loaded=0;
  Promise.allSettled(fonts.map(p=>Promise.resolve(p).catch(()=>{}).then(()=>{
    loaded++;loader.style.setProperty('--load',String(loaded/fonts.length));
  }))).then(()=>{ready=true;loader.style.setProperty('--load','1')});
  setTimeout(()=>{ready=true;loader.style.setProperty('--load','1')},2500);
  const smooth=t=>t*t*(3-2*t);
  const draw=now=>{
    if(finished)return;
    if(start===undefined)start=now;
    if(now-start>=1500&&ready&&release===undefined){release=now;loader.classList.add('intro-leaving');}
    if(release!==undefined){
      const t=Math.min(1,(now-release)/1150);
      // Zoom the name's cutout into the scene, then clear the last spaces between letters.
      const scale=1+Math.pow(t,2.6)*18;
      windowType.style.opacity=String(smooth(Math.min(1,t/.2)));
      windowType.style.transform=`scale(${scale})`;
      paper.style.opacity=String(1-smooth(Math.max(0,Math.min(1,(t-.35)/.65))));
      if(t===1){clean();return;}
    }
    frame=requestAnimationFrame(draw);
  };
  frame=requestAnimationFrame(draw);
  setTimeout(clean,4500);
})();
