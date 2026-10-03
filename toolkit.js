(() => {
  if(location.pathname.endsWith('/index.html'))history.replaceState(history.state,'',location.pathname.slice(0,-10)+location.search+location.hash);
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const header=document.querySelector('.header'),cover=document.querySelector('.toolkit-cover');
  function update(){header.classList.toggle('on-dark',scrollY>cover.offsetHeight-80);}
  addEventListener('scroll',update,{passive:true});addEventListener('resize',update,{passive:true});update();
  const cloud=document.querySelector('.cover-symbols');
  const icons=[...cloud.querySelectorAll('img')];
  let frame=0,lastTime=null,phase=0,visible=true;
  function renderOrbit(){
    const w=cloud.clientWidth,h=cloud.clientHeight;
    icons.forEach((icon,i)=>{
      const angle=i/icons.length*Math.PI*2+phase;
      const near=Math.sin(angle),x=Math.cos(angle)*w*.36;
      const y=(i-(icons.length-1)/2)*h*.115+near*h*.10;
      const z=near*Math.min(w*.24,110);
      icon.style.transform=`translate(-50%,-50%) translate3d(${x}px,${y}px,${z}px) rotateZ(${-Math.cos(angle)*7}deg) scale(${1.08+near*.12})`;
      icon.style.zIndex=String(Math.round(z+120));
    });
  }
  function tick(time){
    frame=0;
    if(lastTime!==null)phase=(phase+Math.min(time-lastTime,64)*Math.PI*2/18000)%(Math.PI*2);
    lastTime=time;renderOrbit();start();
  }
  function start(){if(!frame&&!preference.matches&&!document.hidden&&visible)frame=requestAnimationFrame(tick);}
  function sync(){cancelAnimationFrame(frame);frame=0;lastTime=null;renderOrbit();start();}
  addEventListener('resize',renderOrbit,{passive:true});
  document.addEventListener('visibilitychange',sync);
  preference.addEventListener('change',sync);
  if('IntersectionObserver' in window){
    const orbitObserver=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});
    orbitObserver.observe(cover);
  }
  renderOrbit();start();
  if('IntersectionObserver'  in window && !preference.matches){
    document.documentElement.classList.add('enhanced');
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.05});
    document.querySelectorAll('.tool-group').forEach(section=>observer.observe(section));
  }
})();
