(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const root = document.documentElement, reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = $('.case-hero'), frame = $('.hero-frame'), sculpture = $('.project-sculpture');
  const title = $('.hero-title'), role = $('.hero-role'), header = $('.header');
  const ending = $('.next-track'), chars = $$('.wave-char'), seed = $('.wave-seed'), next = $('.next-project');
  let enabled = !reduced.matches, w = innerWidth, h = innerHeight, y = scrollY, target = y, raf = 0;
  let heroTop=0, endTop=0, widths=[], glyphs=[], sentenceWidth=0, fontHeight=0;
  let px=0,py=0,mx=0,my=0;
  const clamp = (v,a=0,b=1) => Math.max(a,Math.min(b,v));
  const smooth = (a,b,v) => {const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};
  const point = el => el.getBoundingClientRect().top+scrollY;
  function measure(){
    w=innerWidth;h=$('.next-pin').clientHeight||innerHeight;
    heroTop=point(hero);endTop=point(ending);
    widths=chars.map(c=>c.offsetWidth||w*.07);sentenceWidth=widths.reduce((a,b)=>a+b,0);fontHeight=chars[0].offsetHeight||w*.15;
    let cursor=0;glyphs=widths.map(width=>{const x=cursor+width/2;cursor+=width;return{x,width};});
    target=scrollY;y=target;request();
  }
  function render(){
    if(!enabled)return;
    const hp=smooth(0,.75,(y-heroTop)/h);
    frame.style.transform=`scale(${1-hp*.12})`;
    sculpture.style.transform=`translate(-50%,-50%) rotateX(${-14+hp*20+my*5}deg) rotateY(${-24+hp*75+mx*9}deg) rotateZ(${-13+hp*12}deg) scale(${1+hp*.09})`;
    title.style.transform=`translate3d(${hp*70}px,${-hp*h*.14}px,0)`;
    role.style.transform=`translate3d(${-hp*75}px,${hp*h*.08}px,0)`;
    header.classList.toggle('on-dark',y>heroTop+h*.85 && y<endTop+h*3);
    const j=(y-endTop)/h, travel=smooth(-.1,1.75,j), bend=smooth(.2,1.2,j), depart=smooth(1.75,2.3,j);
    const entry=(1-smooth(-.6,-.02,j))*h*.65,shift=w*.3+travel*(sentenceWidth-w*.3);
    const curve=x=>{const u=(x-w*.5)/w;return h*(.48+u*u*.62-(1-bend)*u*.9)+entry;};
    chars.forEach((char,i)=>{const x=w*.5+glyphs[i].x-shift,u=(x-w*.5)/w,angle=Math.atan(h/w*(u*1.24-(1-bend)*.9))*180/Math.PI;
      char.style.transform=`translate(-50%,-50%) translate3d(${x-depart*w*.65}px,${curve(x)-depart*h*.95}px,0) rotate(${angle-depart*18}deg)`;
      char.style.backgroundSize=`${sentenceWidth}px 100%`;char.style.backgroundPosition=`${-glyphs[i].x+glyphs[i].width/2}px 50%`;
    });
    const size=Math.max(12,fontHeight*.11),dotX=w*.5+sentenceWidth+size*.7-shift,fall=smooth(1.73,2.3,j);
    const dx=dotX+(w*.5-dotX)*fall,dy=curve(dotX)+(h*.78-curve(dotX))*fall;
    seed.style.width=seed.style.height=`${size}px`;seed.style.transform=`translate(-50%,-50%) translate3d(${dx}px,${dy}px,0)`;
    const reveal=smooth(2.27,3,j),radius=Math.hypot(w*.5,h*.78)*1.06*reveal;
    next.style.clipPath=`circle(${radius}px at 50% 78%)`;next.inert=reveal<.5;next.setAttribute('aria-hidden',String(reveal<.5));
    if(reveal>.75)header.classList.remove('on-dark');
  }
  function tick(){raf=0;y+=(target-y)*.16;mx+=(px-mx)*.09;my+=(py-my)*.09;if(Math.abs(target-y)<.1)y=target;render();if(Math.abs(target-y)>.1||Math.abs(px-mx)>.002||Math.abs(py-my)>.002)request();}
  function request(){if(enabled&&!raf)raf=requestAnimationFrame(tick);}
  function mode(){enabled=!reduced.matches;root.classList.toggle('motion',enabled);
    if(!enabled){[frame,sculpture,title,role,...chars,seed].forEach(el=>el.removeAttribute('style'));next.style.clipPath='';next.inert=false;next.removeAttribute('aria-hidden');header.classList.remove('on-dark');}
    measure();
  }
  addEventListener('scroll',()=>{target=scrollY;request();},{passive:true});
  addEventListener('pointermove',e=>{px=e.clientX/innerWidth-.5;py=e.clientY/innerHeight-.5;request();},{passive:true});
  addEventListener('resize',measure,{passive:true});reduced.addEventListener('change',mode);document.fonts.ready.then(measure);
  next.addEventListener('focus',()=>{if(enabled){scrollTo({top:endTop+h*3.05,behavior:'instant'});target=y=scrollY;render();}});
  mode();
})();
