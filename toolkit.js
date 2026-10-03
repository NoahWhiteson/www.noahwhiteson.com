(() => {
  if(location.pathname.endsWith('/index.html'))history.replaceState(history.state,'',location.pathname.slice(0,-10)+location.search+location.hash);
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const header=document.querySelector('.header'),cover=document.querySelector('.toolkit-cover');
  function update(){header.classList.toggle('on-dark',scrollY>cover.offsetHeight-80);}
  addEventListener('scroll',update,{passive:true});addEventListener('resize',update,{passive:true});update();
  if('IntersectionObserver' in window && !preference.matches){
    document.documentElement.classList.add('enhanced');
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.05});
    document.querySelectorAll('.tool-group').forEach(section=>observer.observe(section));
  }
})();
