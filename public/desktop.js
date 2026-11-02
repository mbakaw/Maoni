const GAME='https://whats-your-maoni.fastcord1.chatgpt.site';
const STORAGE='maoni-desktop-v1';
const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const colors=['#ffe994','#ffc3de','#c8f3b0','#c9d8ff','#dfc8ff'];
let saved={positions:{},notes:[],hidden:[]};
try{const input=JSON.parse(localStorage.getItem(STORAGE)||'null');if(input&&typeof input==='object'){saved.positions=input.positions&&typeof input.positions==='object'?input.positions:{};saved.notes=Array.isArray(input.notes)?input.notes.filter(n=>n&&typeof n.id==='string'&&typeof n.text==='string').slice(0,20):[];saved.hidden=Array.isArray(input.hidden)?input.hidden.filter(x=>typeof x==='string'):[];}}catch{}
let currentRoute='home',lastApp='conversations',pendingNote=false,pendingRestore=null,zIndex=10,drag=null;
const persist=()=>{try{localStorage.setItem(STORAGE,JSON.stringify(saved));}catch{}};
const isPhone=()=>matchMedia('(max-width:800px)').matches;

function icon(name){
  const paths={
    folder:'<path d="M3 10h12l4 5h23v28H3Z" fill="#ffd74b"/><path d="M3 19h39l-5 24H3Z" fill="#ffe997"/><path d="M5 12h9M6 22h30" stroke="#fff7cb"/>',
    computer:'<path d="M6 4h35v28H6Z" fill="#d9d7d0"/><path d="M10 8h27v19H10Z" fill="#a6c9ed"/><path d="M18 33v5h-9v5h29v-5h-9v-5" fill="#d9d7d0"/><path d="m14 19 6-6 8 10 5-5" fill="none" stroke="#ff46ab"/>',
    sticky:'<path d="M6 5h34v28L29 44H6Z" fill="#ffe98c"/><path d="M29 44V33h11" fill="#e8b84d"/><path d="M13 14h20M13 21h16M13 28h11" fill="none" stroke="#7659c0"/>',
    file:'<path d="M9 3h22l10 10v31H9Z" fill="#fffef7"/><path d="M31 3v11h10" fill="#c8d8fc"/><path d="M15 21h19M15 28h19M15 35h13" stroke="#4554b4"/>',
    camera:'<path d="M4 13h10l4-7h13l4 7h9v28H4Z" fill="#c4b5e9"/><circle cx="24" cy="27" r="10" fill="#e4f3ff"/><circle cx="24" cy="27" r="5" fill="#6576cc"/><path d="M7 17h8" stroke="#fff"/>',
    game:'<path d="M12 14h24l8 22q1 8-7 6l-8-8H19l-8 8q-8 2-7-6Z" fill="#a5d5ec"/><path d="M14 20v12M8 26h12" stroke="#40379b" stroke-width="4"/><circle cx="32" cy="23" r="3" fill="#fa4b9f"/><circle cx="38" cy="29" r="3" fill="#925adb"/>',
    ticket:'<path d="M4 9h40v9a6 6 0 0 0 0 12v9H4v-9a6 6 0 0 0 0-12Z" fill="#ffb9d8"/><path d="M31 10v28" stroke-dasharray="3 3"/>',
  };
  return `<svg viewBox="0 0 48 48" class="pixel-icon" aria-hidden="true" fill="none" stroke="#242238" stroke-width="2" stroke-linejoin="miter" shape-rendering="crispEdges">${paths[name]||paths.folder}</svg>`;
}

const shortcuts=[['computer','home','#/'],['folder','the conversations','#/conversations'],['sticky','the maoni wall','#/wall'],['file','our maoni','#/essays'],['camera','the community','#/community'],['game','Play Maoni',GAME]];
const notes=[
  {id:'note-welcome',color:0,x:14,y:485,rotation:-4,heading:'Your opinion\nbelongs here.',body:'No need to have it all figured out. Bring your maoni.',link:'#/wall',label:'Leave a maoni ↗'},
  {id:'note-people',color:1,x:31,y:520,rotation:3,heading:'Come alone.\nFind your people.',body:'Good conversations. Games. A little healthy disagreement.',link:'#/community',label:'Meet the community ↗'},
  {id:'note-game',color:2,x:48,y:485,rotation:-3,heading:'A Bill. A Maoni.\nA very loud table.',body:'Play on one device or join a room with your own phone.',link:GAME,label:'Open the game ↗'},
  {id:'note-reading',color:4,x:65,y:520,rotation:4,heading:'Get curious.\nGo deeper.',body:'The essays have sources. Follow them. Come back with a maoni.',link:'#/essays',label:'Open the reading folder ↗'},
  {id:'note-next',color:3,x:82,y:485,rotation:-3,heading:'Friday, 6 Nov.\nHillpark Hotel.',body:'It’s Getting Hot in Here!\nThe African Climate.',link:'#/events',label:'Event details ↗'},
];

function position(id,x,y){const p=saved.positions[id];if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y))return {x:Math.max(0,Math.min(88,p.x)),y:Math.max(0,Math.min(760,p.y))};return{x,y};}
function controls(id){return `<div class="window-controls"><button data-desktop-action="hide-window" data-window="${id}" aria-label="Minimize ${id}">_</button><button data-desktop-action="maximize-window" data-window="${id}" aria-label="Maximize ${id}">□</button><button data-desktop-action="hide-window" data-window="${id}" aria-label="Close ${id}">×</button></div>`;}
function windowTitle(id,label,kind){return `<div class="desk-titlebar" data-drag-window="${id}" tabindex="0" aria-label="Move ${label}"><span>${icon(kind)} ${label}</span>${controls(id)}</div>`;}
function noteMarkup(n,custom=false){
  const p=position(n.id,n.x||20,n.y||480),color=colors[Number(n.color)%colors.length]||colors[0];
  return `<article class="sticky-note ${custom?'personal-note':''}" data-window-id="${escapeHtml(n.id)}" style="--note-color:${color};--note-x:${p.x}%;--note-y:${p.y}px;--note-rotation:${n.rotation||-2}deg" ${saved.hidden.includes(n.id)?'hidden':''}><div class="sticky-drag" data-drag-window="${escapeHtml(n.id)}" tabindex="0" aria-label="Move sticky note"><span>${custom?'my_maoni.note':'a_note_from_maoni'}</span><button data-desktop-action="hide-window" data-window="${escapeHtml(n.id)}" aria-label="Minimize sticky note">_</button></div>${custom?`<label class="personal-note-label">Your note · saved on this device<textarea data-personal-note="${escapeHtml(n.id)}" maxlength="500" placeholder="Write your maoni…">${escapeHtml(n.text)}</textarea></label>`:`<div class="sticky-content"><h2>${escapeHtml(n.heading).replace(/\n/g,'<br>')}</h2><p>${escapeHtml(n.body).replace(/\n/g,'<br>')}</p><a href="${n.link}" ${n.link===GAME?'target="_blank" rel="noopener"':''}>${n.label}</a></div>`}<span class="sticky-fold" aria-hidden="true"></span></article>`;
}

export function renderDesktop(){
  const wp=position('welcome',17,70),pp=position('photos',76,60),ep=position('little-note',42,15);
  return `<section class="maoni-desktop" aria-label="Maoni desktop"><div class="desktop-wallpaper-word" aria-hidden="true">maoni</div><div class="desktop-shortcuts" aria-label="Desktop shortcuts">${shortcuts.map(([i,label,url])=>`<a class="desktop-shortcut" href="${url}" ${url===GAME?'target="_blank" rel="noopener"':''} ${label==='home'?'data-desktop-action="welcome"':''}>${icon(i)}<span>${label}</span></a>`).join('')}</div><div class="desktop-corner-label">Maoni OS<br><span>Nairobi edition / everyone welcome</span></div>
  <section class="desk-window welcome-window" data-window-id="welcome" style="left:${wp.x}%;top:${wp.y}px" ${saved.hidden.includes('welcome')?'hidden':''}>${windowTitle('welcome','welcome_to_maoni.exe','computer')}<div class="welcome-menu"><span>File</span><span>Edit your opinion</span><span>View the world</span></div><div class="welcome-body"><span class="desktop-eyebrow">YOU’VE FOUND YOUR THIRD SPACE.</span><h1>OUR MAONI.<br><span>OUR OPINION.</span></h1><p>A discussion club in Nairobi for good conversations,<br class="desktop-linebreak"> games and finding your people.</p><div class="welcome-actions"><a class="retro-button primary-retro" href="#/conversations">Enter the conversations ${icon('folder')}</a><a class="retro-button" href="${GAME}" target="_blank" rel="noopener">Play Maoni ↗</a></div></div><div class="window-status"><span>Ready for your maoni.</span><span>100% curious</span></div></section>
  <section class="desk-window desktop-photo-window" data-window-id="photos" style="left:${pp.x}%;top:${pp.y}px" ${saved.hidden.includes('photos')?'hidden':''}>${windowTitle('photos','our_people.jpg','camera')}<div class="photo-window-body"><button class="photo-button" data-photo="0" aria-label="Open original photograph: A man sharing his maoni"><img src="/assets/people-talking.jpg" alt="People sharing a conversation at Maoni"></button><p>Come for the conversations.<br><b>Stay for the people.</b></p><a href="#/community" class="retro-button">Open photo folder ↗</a></div><div class="window-status"><span>Original photo</span><span>9 memories</span></div></section>
  <aside class="desk-window little-desktop-window" data-window-id="little-note" style="left:${ep.x}%;top:${ep.y}px" ${saved.hidden.includes('little-note')?'hidden':''}>${windowTitle('little-note','a_little_reminder.txt','file')}<div class="little-window-body"><span class="blinking-caret" aria-hidden="true">▌</span>Everyone has a maoni.<br>Yes, even you.</div></aside>
  <div class="desktop-sticky-layer">${notes.map(n=>noteMarkup(n)).join('')}${saved.notes.map(n=>noteMarkup(n,true)).join('')}</div><button class="desktop-add-note" data-desktop-action="new-note">${icon('sticky')} + New sticky note</button><div class="desktop-bottom-status"><span>Drag a window. Open a folder. Leave a maoni.</span><span>Your personal notes stay on this device.</span></div></section>`;
}

function closeStart(){document.querySelector('#start-menu').hidden=true;document.querySelector('#start-button').setAttribute('aria-expanded','false');}
function focusWindow(el){if(!el)return;el.style.zIndex=String(++zIndex);}
function restoreWindows(onlyNotes=false){document.querySelectorAll(onlyNotes?'.sticky-note':'[data-window-id]').forEach(el=>{el.hidden=false;saved.hidden=saved.hidden.filter(id=>id!==el.dataset.windowId);});persist();}
function goHomeThen(action){if(currentRoute!=='home'){pendingNote=action==='new-note';pendingRestore=action==='new-note'?null:action;location.hash='#/';return;}if(action==='new-note')addNote();else restoreWindows(action==='show-notes');}
function addNote(){
  if(saved.notes.length>=20){const el=document.querySelector('[data-personal-note]');el?.focus();return;}
  const n={id:`personal-${Date.now().toString(36)}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`,text:'',color:(saved.notes.length+1)%colors.length,x:28+(saved.notes.length%4)*10,y:180+(saved.notes.length%4)*60,rotation:(saved.notes.length%2?2:-2)};
  saved.notes.push(n);persist();document.querySelector('.desktop-sticky-layer')?.insertAdjacentHTML('beforeend',noteMarkup(n,true));const el=document.querySelector(`[data-window-id="${n.id}"]`);focusWindow(el);el?.querySelector('textarea')?.focus();
}

export function syncDesktop(route){
  currentRoute=route;document.body.dataset.desktopPage=route;
  const names={home:'home',conversations:'the conversations',conversation:'The Conversation',wall:'the maoni wall',essays:'our maoni',essay:'The Essay',community:'the community',events:'Upcoming Maoni'};
  const title=names[route]||'Maoni Browser';document.querySelector('#app-window-title').textContent=`${title} — Maoni Browser`;document.querySelector('#desktop-address').textContent=`maoni://${route==='home'?'desktop':route}`;document.querySelector('#task-browser').textContent=route==='home'?'Maoni Browser':title;
  if(route!=='home'){lastApp=location.hash;document.querySelector('#app-window').classList.remove('app-maximized');}
  closeStart();if(route==='home'&&pendingRestore){restoreWindows(pendingRestore==='show-notes');pendingRestore=null;}if(route==='home'&&pendingNote){pendingNote=false;addNote();}
}

document.querySelector('#start-button').addEventListener('click',()=>{const menu=document.querySelector('#start-menu');menu.hidden=!menu.hidden;document.querySelector('#start-button').setAttribute('aria-expanded',!menu.hidden);});
document.addEventListener('click',event=>{
  const actionEl=event.target.closest('[data-desktop-action]');
  if(actionEl){const action=actionEl.dataset.desktopAction;
    if(action==='new-note')goHomeThen('new-note');
    if(action==='show-windows')goHomeThen('show-windows');
    if(action==='show-notes')goHomeThen('show-notes');
    if(action==='show-desktop')location.hash='#/';
    if(action==='welcome'){if(currentRoute==='home'){event.preventDefault();const win=document.querySelector('[data-window-id="welcome"]');win.hidden=false;saved.hidden=saved.hidden.filter(id=>id!=='welcome');persist();focusWindow(win);}}
    if(action==='restore-app'){if(currentRoute==='home')location.hash=lastApp.startsWith('#')?lastApp:`#/${lastApp}`;else location.hash='#/';}
    if(action==='help')document.querySelector('#desktop-help').showModal();
    if(action==='close-help')document.querySelector('#desktop-help').close();
    if(action==='hide-window'){const id=actionEl.dataset.window;const win=document.querySelector(`[data-window-id="${id}"]`);if(win){win.hidden=true;if(!saved.hidden.includes(id))saved.hidden.push(id);persist();}}
    if(action==='maximize-window'){const win=document.querySelector(`[data-window-id="${actionEl.dataset.window}"]`);win?.classList.toggle('window-maximized');focusWindow(win);}
    closeStart();
  }
  const appAction=event.target.closest('[data-app-control]')?.dataset.appControl;
  if(appAction==='close'||appAction==='minimize')location.hash='#/';
  if(appAction==='maximize')document.querySelector('#app-window').classList.toggle('app-maximized');
  const windowEl=event.target.closest('[data-window-id]');if(windowEl)focusWindow(windowEl);
  if(!event.target.closest('#start-menu,#start-button'))closeStart();
});
document.addEventListener('input',event=>{if(!event.target.matches('[data-personal-note]'))return;const note=saved.notes.find(n=>n.id===event.target.dataset.personalNote);if(note){note.text=event.target.value.slice(0,500);persist();}});
document.addEventListener('pointerdown',event=>{
  if(isPhone()||event.button!==0||event.target.closest('button,a,input,textarea'))return;
  const handle=event.target.closest('[data-drag-window]');if(!handle)return;
  const win=document.querySelector(`[data-window-id="${handle.dataset.dragWindow}"]`),root=document.querySelector('.maoni-desktop');if(!win||!root||win.classList.contains('window-maximized'))return;
  const wr=win.getBoundingClientRect(),rr=root.getBoundingClientRect();drag={win,root,handle,id:win.dataset.windowId,startX:event.clientX,startY:event.clientY,left:wr.left-rr.left,top:wr.top-rr.top};handle.setPointerCapture(event.pointerId);focusWindow(win);win.classList.add('is-dragging');event.preventDefault();
});
document.addEventListener('pointermove',event=>{
  if(!drag)return;const{win,root}=drag;const x=Math.max(0,Math.min(root.clientWidth-win.offsetWidth,drag.left+event.clientX-drag.startX));const y=Math.max(0,Math.min(root.clientHeight-win.offsetHeight-30,drag.top+event.clientY-drag.startY));win.style.left=`${x/root.clientWidth*100}%`;win.style.top=`${y}px`;saved.positions[drag.id]={x:x/root.clientWidth*100,y};
});
function endDrag(){if(!drag)return;drag.win.classList.remove('is-dragging');persist();drag=null;}
document.addEventListener('pointerup',endDrag);document.addEventListener('pointercancel',endDrag);
document.addEventListener('keydown',event=>{
  if(event.key==='Escape')closeStart();
  const handle=event.target.closest('[data-drag-window]');if(!handle||isPhone()||!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key))return;
  event.preventDefault();const win=document.querySelector(`[data-window-id="${handle.dataset.dragWindow}"]`),root=document.querySelector('.maoni-desktop');if(!win||!root)return;const wr=win.getBoundingClientRect(),rr=root.getBoundingClientRect(),step=event.shiftKey?20:5;
  const x=Math.max(0,Math.min(root.clientWidth-win.offsetWidth,wr.left-rr.left+(event.key==='ArrowRight'?step:event.key==='ArrowLeft'?-step:0)));const y=Math.max(0,Math.min(root.clientHeight-win.offsetHeight-30,wr.top-rr.top+(event.key==='ArrowDown'?step:event.key==='ArrowUp'?-step:0)));win.style.left=`${x/root.clientWidth*100}%`;win.style.top=`${y}px`;saved.positions[handle.dataset.dragWindow]={x:x/root.clientWidth*100,y};persist();
});
function updateClock(){document.querySelector('#desktop-clock').textContent=new Intl.DateTimeFormat('en-KE',{hour:'2-digit',minute:'2-digit',hour12:true,timeZone:'Africa/Nairobi'}).format(new Date());}
updateClock();setInterval(updateClock,30000);
