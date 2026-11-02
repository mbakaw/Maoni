const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

function like(el){
  const span=el.querySelector('span');
  const m=span.textContent.match(/(\d+)/);
  if(!m)return;
  const n=parseInt(m[1],10)+1;
  span.textContent=`♥ ${n}`;
  el.animate([{transform:'scale(1)'},{transform:'scale(1.045) rotate(-1.2deg)'},{transform:'scale(1)'}],{duration:360,easing:'cubic-bezier(.2,.8,.2,1)'});
}

function addMaoni(e){
  e.preventDefault();
  const input=document.getElementById('maoniInput');
  const text=input.value.trim();
  if(!text)return false;
  const note=document.createElement('button');
  const classes=['n1','n2','n3','n4'];
  note.className=`maoni-note tilt-card ${classes[Math.floor(Math.random()*classes.length)]}`;
  note.onclick=function(){like(this)};
  const b=document.createElement('b');
  b.textContent=text;
  const s=document.createElement('span');
  s.textContent='♡ 0';
  note.append(b,s);
  document.getElementById('maoniGrid').prepend(note);
  input.value='';
  wireTilt(note);
  note.animate([{opacity:0,transform:'translateY(20px) scale(.94) rotate(-3deg)'},{opacity:1,transform:'translateY(0) scale(1) rotate(0)'}],{duration:520,easing:'cubic-bezier(.2,.8,.2,1)'});
  return false;
}

function wireTilt(card){
  if(reduceMotion||window.innerWidth<900)return;
  card.addEventListener('pointermove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateX(${y*-5}deg) rotateY(${x*7}deg) translateY(-5px)`;
  });
  card.addEventListener('pointerleave',()=>{card.style.transform=''});
}

document.querySelectorAll('.tilt-card').forEach(wireTilt);

if(!reduceMotion&&window.innerWidth>=900){
  const glow=document.querySelector('.cursor-glow');
  window.addEventListener('pointermove',e=>{
    glow.style.left=`${e.clientX}px`;
    glow.style.top=`${e.clientY}px`;
  },{passive:true});

  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('pointermove',e=>{
      const r=el.getBoundingClientRect();
      const x=(e.clientX-(r.left+r.width/2))*.12;
      const y=(e.clientY-(r.top+r.height/2))*.12;
      el.style.transform=`translate(${x}px,${y}px) scale(1.02)`;
    });
    el.addEventListener('pointerleave',()=>{el.style.transform=''});
  });

  document.querySelectorAll('.parallax-zone').forEach(zone=>{
    zone.addEventListener('pointermove',e=>{
      const r=zone.getBoundingClientRect();
      const x=((e.clientX-r.left)/r.width-.5)*2;
      const y=((e.clientY-r.top)/r.height-.5)*2;
      zone.querySelectorAll('.portrait-card,.photo,.game-card,.orb,.sticker,.mini-sticker').forEach((el,i)=>{
        const depth=(i%4+1)*4;
        el.style.translate=`${x*depth}px ${y*depth}px`;
      });
    });
    zone.addEventListener('pointerleave',()=>zone.querySelectorAll('.portrait-card,.photo,.game-card,.orb,.sticker,.mini-sticker').forEach(el=>el.style.translate=''));
  });
}

const navLinks=[...document.querySelectorAll('.nav-links a')];
const sections=['top','conversations','wall','our-maoni','community'].map(id=>document.getElementById(id)).filter(Boolean);
const navObserver=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!visible)return;
  navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${visible.target.id}`));
},{rootMargin:'-30% 0px -55% 0px',threshold:[0,.2,.5,1]});
sections.forEach(s=>navObserver.observe(s));
