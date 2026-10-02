(() => {
  const root=document.documentElement, preference=matchMedia('(prefers-reduced-motion: reduce)');
  const emblem=document.querySelector('.project-emblem'), preview=document.querySelector('.product-frame');
  const reveals=[...document.querySelectorAll('.reveal')];let observer,raf=0;
  const render=()=>{raf=0;if(preference.matches)return;
    const h=innerHeight, y=Math.max(0,Math.min(1,scrollY/h));
    emblem.style.transform=`translateY(${-y*60}px) rotate(${-8+y*16}deg) scale(${1-y*.12})`;
    const box=preview.getBoundingClientRect(), progress=Math.max(0,Math.min(1,(h-box.top)/(h+box.height)));
    preview.style.transform=`perspective(1400px) rotateX(${(1-progress)*4}deg) scale(${.94+progress*.06})`;
  };
  const request=()=>{if(!raf)raf=requestAnimationFrame(render)};
  const mode=()=>{observer?.disconnect();root.classList.toggle('project-motion',!preference.matches);
    if(preference.matches||!('IntersectionObserver' in window)){reveals.forEach(el=>el.classList.add('in-view'));emblem.style.removeProperty('transform');preview.style.removeProperty('transform');return;}
    observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}}),{threshold:.12});
    reveals.forEach(el=>observer.observe(el));request();
  };
  addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});preference.addEventListener('change',mode);mode();
})();
