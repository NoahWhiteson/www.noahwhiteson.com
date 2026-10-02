(() => {
  'use strict';
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const root=document.documentElement, preference=matchMedia('(prefers-reduced-motion: reduce)');
  const hero=$('.project-hero'), heroPin=$('.project-hero-pin'), emblem=$('.project-emblem');
  const field=$('.project-color-field'), roles=$$('.project-role'), nav=$('.project-nav');
  const statement=$('.project-statement'), chars=$$('.statement-char');
  const visual=$('.product-visual'), product=$('.product-frame');
  const features=$('.project-features'), chapters=$$('.feature-chapter');
  const counter=$('.feature-counter'), pagination=$('.feature-pagination');
  const ending=$('.project-ending'), endingPin=$('.ending-pin'), glyphs=$$('.ending-char');
  const seed=$('.ending-seed'), next=$('.next-project');
  let enabled=false,raf=0,h=innerHeight,w=innerWidth,target=scrollY,position=scrollY;
  let heroTop=0,statementTop=0,visualTop=0,featuresTop=0,endingTop=0;
  let metrics=[],sentenceWidth=0,fontSize=0,px=0,py=0,mx=0,my=0;
  const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
  const smooth=(a,b,x)=>{const n=clamp((x-a)/(b-a));return n*n*(3-2*n)};
  const point=e=>e.getBoundingClientRect().top+scrollY;
  function measure(){
    h=endingPin.clientHeight||innerHeight;w=innerWidth;
    heroTop=point(hero);statementTop=point(statement);visualTop=point(visual);featuresTop=point(features);endingTop=point(ending);
    let cursor=0;metrics=glyphs.map(c=>{const width=c.offsetWidth||w*.06;const x=cursor+width/2;cursor+=width;return{x,width}});
    sentenceWidth=cursor;fontSize=glyphs[0].offsetHeight||h*.2;
  }
  function render(){
    if(!enabled)return;
    const p=smooth(0,.85,(position-heroTop)/h);
    heroPin.style.transform=`scale(${1-p*.12})`;
    heroPin.style.borderRadius=`${18+p*32}px`;
    roles[0].style.transform=`translate(${p*12}vw,${-p*14}vh)`;
    roles[1].style.transform=`translate(${-p*12}vw,${p*13}vh)`;
    emblem.style.transform=`translate(-50%,-50%) rotateX(${-16+my*9+p*45}deg) rotateY(${-25+mx*20+p*70}deg) rotateZ(${-12+mx*3-p*25}deg) scale(${1-p*.2})`;
    field.style.transform=`translate(${mx*30}px,${my*20}px) scale(1.1)`;
    nav.classList.toggle('on-dark',position>heroTop+h*.75&&(position<visualTop-h*.15||position>featuresTop-h*.15));
    const statementProgress=(position-statementTop)/h;
    chars.forEach((c,i)=>{const n=i/Math.max(1,chars.length-1),settle=smooth(-.45+n*.32,.3+n*.32,statementProgress),depart=smooth(.78,1.3,statementProgress);
      const y=(1-settle)*(1+Math.pow(n,1.1))*h*.65-depart*Math.pow(n,1.1)*h*.3;
      c.style.transform=`translateY(${y}px) rotate(${(1-settle)*(n-.5)*20}deg)`;
    });
    const v=(position-visualTop)/h, unfold=smooth(-.15,1.05,v),leave=smooth(1.2,1.75,v);
    product.style.transform=`translate(-50%,-50%) translateY(${-leave*h*.14}px) rotateX(${(1-unfold)*28}deg) rotateY(${(1-unfold)*-12}deg) rotateZ(${(1-unfold)*-5}deg) scale(${.73+unfold*.27})`;
    const j=(position-featuresTop)/h;
    const active=clamp(Math.floor((j+.1)/.95),0,2);
    counter.textContent=String(active+1).padStart(2,'0');pagination.textContent=`${String(active+1).padStart(2,'0')} / 03`;
    chapters.forEach((chapter,i)=>{
      const local=j-i*.95,arrive=smooth(-.5,.05,local),depart=i===2?smooth(1.4,1.85,local):smooth(.65,1,local);
      chapter.style.transform=`translateY(-50%) translate3d(0,${(1-arrive)*h*.85-depart*h*.8}px,0) rotate(${(1-arrive)*5-depart*5}deg)`;
      chapter.style.visibility=local<-.55||local>(i===2?1.9:1.05)?'hidden':'visible';
      chapter.setAttribute('aria-hidden',String(i!==active||j<-.3));
    });
    const travel=(position-endingTop)/h, sweep=smooth(-.1,1.8,travel), bend=smooth(.2,1.2,travel), exit=smooth(1.75,2.3,travel);
    const shift=w*.3+sweep*(sentenceWidth-w*.3), entry=(1-smooth(-.55,0,travel))*h*.6;
    const curve=x=>{const u=(x-w*.5)/w;return h*(.46+u*u*.58-(1-bend)*u*.85)+entry};
    glyphs.forEach((c,i)=>{
      const x=w*.5+metrics[i].x-shift,u=(x-w*.5)/w,y=curve(x);
      const angle=Math.atan(h/w*(u*1.16-(1-bend)*.85))*180/Math.PI;
      c.style.transform=`translate(-50%,-50%) translate3d(${x-exit*w*.65}px,${y-exit*h*.95}px,0) rotate(${angle-exit*18}deg)`;
      c.style.backgroundSize=`${sentenceWidth}px 100%`;c.style.backgroundPosition=`${-metrics[i].x+metrics[i].width/2}px 50%`;
    });
    const size=Math.max(12,fontSize*.1),dotX=w*.5+sentenceWidth+size*.7-shift,fall=smooth(1.72,2.3,travel);
    seed.style.width=seed.style.height=`${size}px`;
    seed.style.transform=`translate(-50%,-50%) translate3d(${dotX+(w*.5-dotX)*fall}px,${curve(dotX)+(h*.76-curve(dotX))*fall}px,0)`;
    const reveal=smooth(2.27,3.05,travel);
    next.style.clipPath=`circle(${Math.hypot(w*.5,h*.76)*1.07*reveal}px at 50% 76%)`;
    next.inert=reveal<.5;next.setAttribute('aria-hidden',String(reveal<.5));
    nav.style.opacity=String(1-smooth(2.25,2.7,travel));nav.inert=travel>2.65;
  }
  function tick(){position+=(target-position)*.16;mx+=(px-mx)*.09;my+=(py-my)*.09;
    if(Math.abs(target-position)<.15)position=target;render();
    if(enabled&&(Math.abs(target-position)>.15||Math.abs(px-mx)>.002||Math.abs(py-my)>.002))raf=requestAnimationFrame(tick);else raf=0;
  }
  function request(){if(enabled&&!raf)raf=requestAnimationFrame(tick)}
  function mode(){enabled=!preference.matches;root.classList.toggle('project-motion',enabled);if(raf)cancelAnimationFrame(raf);raf=0;
    if(!enabled){[heroPin,emblem,field,...roles,...chars,product,...chapters,...glyphs,seed,next,nav].forEach(e=>e.removeAttribute('style'));
      chapters.forEach(e=>e.removeAttribute('aria-hidden'));next.removeAttribute('aria-hidden');next.inert=nav.inert=false;
      // Preserve the next project's palette when clearing animation overrides.
      next.style.setProperty('--next-accent',next.dataset.accent);next.style.setProperty('--next-ink',next.dataset.ink);next.style.setProperty('--next-tint',next.dataset.tint);
      nav.classList.remove('on-dark');
    }
    measure();target=position=scrollY;render();request();
  }
  addEventListener('scroll',()=>{target=scrollY;request()},{passive:true});
  addEventListener('resize',()=>{measure();target=scrollY;request()},{passive:true});
  heroPin.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||!enabled)return;const b=heroPin.getBoundingClientRect();px=clamp((e.clientX-b.left)/b.width)*2-1;py=clamp((e.clientY-b.top)/b.height)*2-1;request()},{passive:true});
  heroPin.addEventListener('pointerleave',()=>{px=py=0;request()});
  preference.addEventListener('change',mode);mode();
  document.fonts?.ready.then(()=>{measure();request()});
})();
