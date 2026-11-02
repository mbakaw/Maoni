import { renderDesktop, syncDesktop } from './desktop.js';
const GAME_URL = 'https://whats-your-maoni.fastcord1.chatgpt.site';
const main = document.querySelector('#main-content');
const photos = [
  {file:'people-talking.jpg',alt:'A man in a red sweatshirt sharing his maoni at a table',caption:'SOMETHING TO SAY.'},
  {file:'people-laughing.jpg',alt:'A woman laughing during a Maoni conversation',caption:'GOOD CONVERSATIONS. GOOD COMPANY.'},
  {file:'friends.jpg',alt:'Friends smiling together at a Maoni event',caption:'COME FOR THE CONVERSATION.'},
  {file:'at-the-table.jpg',alt:'People listening and talking across a table at Maoni',caption:'EVERY MAONI HAS A TABLE.'},
  {file:'hot-take.jpg',alt:'A woman reacting during a lively conversation at Maoni',caption:'WE HEARD YOUR HOT TAKES.'},
  {file:'conversation.jpg',alt:'A woman joining a conversation with people at her table',caption:'HEALTHY DISAGREEMENT INCLUDED.'},
  {file:'maoni-host.jpg',alt:'A Maoni host holding a microphone beside the quiz screen',caption:'PASS THE MIC.'},
  {file:'around-the-table.jpg',alt:'Two women enjoying a conversation at a Maoni event',caption:'STAY FOR THE PEOPLE.'},
  {file:'good-company.jpg',alt:'People talking and listening together at a Maoni event',caption:'THERE’S ROOM FOR YOUR MAONI.'},
];
const conversations = [
  {id:'stranger-danger',title:'Stranger Danger?! African Xenophobia',type:'Discussions',topic:'Identity & culture',photo:2,description:'Who belongs? Who decides? A conversation about othering, borders and the way we treat each other on this continent.',questions:['When does pride in where we come from turn into exclusion?','What does being Pan-African mean in everyday life?','Who benefits when we turn on each other?']},
  {id:'do-we-have-solutions',title:'Do We Have Solutions?',type:'Discussions',topic:'Politics & power',photo:8,description:'We know what’s wrong. What do we think should happen next? Bring an idea, a doubt or a different way of looking at the problem.',questions:['What does a solution look like to the people living with the problem?','Which changes can we make together?','How do we hold power accountable after the conversation?']},
  {id:'white-and-african',title:'Can You Be White & African?',type:'Discussions',topic:'Identity & culture',photo:3,description:'A question about identity, belonging, history and what we mean when we say African.',questions:['Is African an identity, a geography or a political commitment?','How do power and colonial history shape belonging?','What does belonging ask of us?']},
  {id:'trivia-night',title:'Maoni × Quiz Drama: Trivia Night',type:'Trivia',topic:'Life & community',photo:6,description:'A quiz, a table of people and a lot of opinions about the right answer. Trivia Night brings the Maoni community together with Quiz Drama.',questions:['Who is on your dream quiz team?','What category do you think you’d win?','Ready for the next one? November 20 is the next announced trivia date.']},
  {id:'art-and-the-artist',title:'Can You Separate Art from the Artist?',type:'Discussions',topic:'Identity & culture',photo:1,description:'The music we love. The people who made it. The decisions we make about what we support.',questions:['What do we owe the people harmed by someone whose work we enjoy?','Is listening the same as endorsing?','Where do you draw the line, and why?']},
  {id:'the-other',title:'What / Who Is the Other?',type:'Discussions',topic:'Life & community',photo:4,description:'The labels we use. The groups we put people in. The people who get left outside.',questions:['Who gets treated as an outsider in the spaces you know?','What assumptions have you had to unlearn?','How can a community make room for difference?']},
];
const essays = [
  {id:'el-nino',title:'El Niño isn’t the whole story.',label:'CLIMATE · KENYA',time:'3 MIN READ',summary:'Rainfall, warming and the choices that decide who is left exposed. Start with the seasons, then ask who carries the cost.',cover:'EL NIÑO ISN’T<br>THE WHOLE<br>STORY.',body:`
    <p class="lede">Calling every flood “El Niño” hides how the weather works. It also lets the decisions that put people in danger disappear from the conversation.</p>
    <h2>Start with the season.</h2>
    <p>El Niño is part of a natural ocean and atmosphere cycle in the tropical Pacific. Its effects reach East Africa, but the season and the Indian Ocean matter. ICPAC’s explanation of the short rains shows why a positive Indian Ocean Dipole can favour wetter conditions in eastern Kenya, Somalia and south-eastern Ethiopia: warmer water in the western Indian Ocean supports rising moist air and changes the winds carrying that moisture. <a href="#source-1">[1]</a></p>
    <p>That is a mechanism, not a promise that every place gets the same rain. A regional pattern cannot tell you which road will flood or which household will lose its home. It is also different from the long-term warming caused by greenhouse gas emissions.</p>
    <h2>Rain falls on a built world.</h2>
    <p>The research team that examined the 2024 long rains in East Africa included Kenyan researchers Joyce Kimutai and Mary Kilavi. Their study found that El Niño and the Indian Ocean Dipole had a negligible influence on the rainfall event they analysed. It also identified urban growth into flood-prone areas and land-use change as factors worsening the impacts. The estimate of a warming influence came with substantial uncertainty in the regional data and models. <a href="#source-2">[2]</a></p>
    <p>So the question has to go beyond how much rain fell. Where can people afford to live? What protection exists? Who receives an early warning, and who can act on it? A warning means very different things to someone who can leave and someone who would lose their income or shelter by doing so.</p>
    <h2>What are we demanding?</h2>
    <p>The study calls for better flood protection, preparedness and social protection. Our question for the room is who should decide what those protections look like. Residents should have a say in decisions about the places where they live. Climate policy has to be answerable to them.</p>
    <p>Bring that to the table: when we call a disaster natural, which decisions stop being questioned?</p>`,sources:[
      {id:1,title:'ICPAC / FSNWG — El Niño and Positive Indian Ocean Dipole, October 2023',url:'https://www.icpac.net/fsnwg/special-report-el-ni%C3%B1o-and-positive-indian-ocean-dipole-to-have-significant-multi-sectoral-impacts-in-east-africa/',note:'Regional explanation of short-rains drivers. This is a 2023 report, not a current forecast.'},
      {id:2,title:'Kimutai and colleagues / World Weather Attribution — East African long rains, May 2024',url:'https://www.worldweatherattribution.org/urban-planning-at-the-heart-of-increasingly-severe-east-african-flood-impacts-in-a-warming-world/',note:'Event study of rainfall, exposure and vulnerability, with its limitations and full study linked.'},
    ]},
  {id:'land-care-and-power',title:'Land, care and who gets a say.',label:'CLIMATE · COMMUNITY',time:'3 MIN READ',summary:'Kenyan women have been organising around land and livelihoods for decades. What changes when we start there?',cover:'LAND. CARE.<br>WHO GETS<br>A SAY?',body:`
    <p class="lede">A climate conversation in Kenya can start with people already organising around water, land and livelihoods. Their work has a history. It also raises questions about who holds power.</p>
    <h2>There is a history here.</h2>
    <p>Wangari Maathai founded the Green Belt Movement in 1977 under the National Council of Women of Kenya. The movement describes tree planting as an entry point into community empowerment and better livelihoods. Its work connects environmental restoration with women’s organising, water harvesting and climate resilience. <a href="#source-1">[1]</a></p>
    <p>This gives us a practical place to begin. Ask what the people doing the work need to keep doing it. Ask who controls the land. Ask whether the people caring for a place have power over decisions that affect it.</p>
    <h2>Whose time pays for it?</h2>
    <p>The Green Belt Movement’s climate programme describes how scarcity puts pressure on women responsible for securing food and water, particularly in marginalised arid and semi-arid areas. It argues that climate action needs meaningful community participation and support for livelihoods. <a href="#source-2">[2]</a></p>
    <p>That is a concrete way to discuss care. If a household needs more time to find water, someone has to provide that time. If a project asks a community to maintain a restored area, who does the work? Are they paid? Can they refuse? Counting a project’s trees does not answer those questions.</p>
    <h2>What would accountability look like?</h2>
    <p>Kenya’s National Climate Change Action Plan for 2023–2027 sets out priorities for adaptation and mitigation. A plan provides something to examine: whose needs appear in the priorities, which actions get resources and how people can check what has been delivered. <a href="#source-3">[3]</a></p>
    <p>Our argument is that community participation should include the power to change a decision. That means discussing land rights, control over resources and the labour behind environmental care. It means listening to the people doing that work before a project is designed.</p>
    <p>A question for the room: what would a climate solution look like if the people living with its consequences could set its terms?</p>`,sources:[
      {id:1,title:'Green Belt Movement — Who We Are',url:'https://www.greenbeltmovement.org/who-we-are/',note:'The movement’s own account of its origins, mission and work.'},
      {id:2,title:'Green Belt Movement — Climate Change, Adaptation and Resilience',url:'https://www.greenbeltmovement.org/climate-change/',note:'Its account of community participation, livelihoods and women’s experiences. Historical forest-cover figures on this page are not used here.'},
      {id:3,title:'Kenya Climate Change Knowledge Portal — NCCAP 2023–2027',url:'https://kcckp.go.ke/resources/acts/national-climate-change-action-plan-nccap-2023-2027',note:'Official national action-plan overview and document access.'},
    ]},
];
const topicList = ['All', 'Life & community', 'Politics & power', 'Climate & land', 'Identity & culture'];
let currentPage = 'home';
let archiveFilter = 'All';
let archiveSearch = '';
let wallTopic = 'All';
let wallSort = 'newest';
let wallPosts = [];
let photoIndex = 0;
let toastTimer;
let renderGeneration = 0;
let visitorToken;
const newVisitorToken = () => Array.from(crypto.getRandomValues(new Uint8Array(24)), n => n.toString(16).padStart(2,'0')).join('');
try { visitorToken = localStorage.getItem('maoni-visitor'); if (!visitorToken) {visitorToken=newVisitorToken(); localStorage.setItem('maoni-visitor',visitorToken);} } catch { visitorToken=newVisitorToken(); }
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const photoButton = (index,cls='') => `<button class="photo-button ${cls}" data-photo="${index}" aria-label="Open original photograph: ${esc(photos[index].alt)}"><img src="/assets/${photos[index].file}" alt="${esc(photos[index].alt)}" loading="lazy"></button>`;
const gameLink = (label='PLAY MAONI',cls='button lime') => `<a class="${cls}" href="${GAME_URL}" target="_blank" rel="noopener">${label} <span>↗</span></a>`;
const gameBand = () => `<section class="game-band"><div class="game-band-inner"><div><span class="eyebrow">SAME MAONI. A DIFFERENT KIND OF TABLE.</span><h2>GOT A MAONI?<br><span>PLAY IT.</span></h2></div><div class="game-card-art" aria-hidden="true"><img src="/assets/card-25.jpg" alt=""><img src="/assets/card-129.jpg" alt=""></div><div><p>A Bill. A Maoni. A hidden role.<br>Take the conversation into the game. Play on one shared device or join with a room code.</p>${gameLink('GO TO THE GAME')}<p style="font-size:10px;margin:16px 0 0;letter-spacing:.6px">OPENS THE SEPARATE MAONI GAME WEBSITE.</p></div></div></section>`;
const conversationCard = c => `<a class="conversation-card" href="#/conversation/${c.id}"><div class="image-wrap"><img src="/assets/${photos[c.photo].file}" alt="${esc(photos[c.photo].alt)}" loading="lazy"><span class="card-category">${c.type.toUpperCase()}</span><span class="card-number">0${conversations.indexOf(c)+1}</span></div><h3>${esc(c.title)}</h3><div class="card-bottom"><span>LET’S TALK ABOUT IT</span><b aria-hidden="true">↗</b></div></a>`;
const essayCard = e => `<a class="essay-card" href="#/essay/${e.id}"><div class="essay-cover"><span class="eyebrow">${e.label}</span><h2>${e.cover}</h2><span class="eyebrow">THE ESSAYS <span aria-hidden="true">↗</span></span></div><p>${e.summary}</p><div class="essay-meta"><span>${e.time} · ${e.sources.length} SOURCES</span><span>READ THE ESSAY ↗</span></div></a>`;

function upcomingCard() {
  const past = Date.now() > Date.parse('2026-11-06T23:00:00+03:00');
  return `<section class="up-next"><div class="event-card-copy"><div class="event-topline"><span class="slant-label">${past?'RECENT MAONI':'UP NEXT ↗'}</span><span class="event-edition">OPINION NIGHT / NAIROBI</span></div><h2>IT’S GETTING<br><span>HOT IN HERE!</span></h2><p class="handwritten">The African Climate</p><div class="climate-topics"><a href="#/wall?topic=Life%20%26%20community">THE SOCIAL CLIMATE</a><a href="#/wall?topic=Politics%20%26%20power">THE POLITICAL CLIMATE</a><a href="#/essays">THE ENVIRONMENTAL CLIMATE</a></div><div class="event-meta"><span><b aria-hidden="true">↗</b> FRI, 6 NOV 2026</span><span>HILLPARK HOTEL, NAIROBI</span></div><a class="button black" href="#/events">${past?'THE CONVERSATION':'I’LL BE THERE'} <span>↗</span></a><a class="text-link" href="#/essays">READ UP ↗</a></div><figure class="up-next-photo">${photoButton(1)}<figcaption>GOOD CONVERSATIONS. VERY REAL REACTIONS.</figcaption><span class="photo-sticker" aria-hidden="true">BRING<br>YOUR<br>MAONI.</span></figure></section>`;
}

function home() { return renderDesktop(); }

function conversationsPage() {
  return `<div class="container archive"><div class="page-heading"><span class="eyebrow">WHAT ARE WE TALKING ABOUT?</span><h1>THE<br><span class="marker blue-marker">CONVERSATIONS.</span></h1><div class="scribble-line" aria-hidden="true"></div><p>Big questions. Everyday things. All the maoni in between.<br>Explore the topics and keep the conversation going.</p></div><div class="filters" aria-label="Filter conversations">${['All','Discussions','Trivia'].map(t=>`<button class="filter ${archiveFilter===t?'active':''}" data-archive-filter="${t}" aria-pressed="${archiveFilter===t}">${t}</button>`).join('')}<label class="search-wrap"><input id="conversation-search" type="search" value="${esc(archiveSearch)}" aria-label="Search conversations" placeholder="Find a conversation…"><span aria-hidden="true">⌕</span></label></div><div id="conversation-results" class="conversation-grid"></div><div class="quote-banner"><div><span class="eyebrow">THINKING ABOUT SOMETHING ELSE?</span><h2>THAT’S A MAONI TOO.</h2></div><a class="button black" href="#/wall">PUT IT ON THE WALL <span>↗</span></a></div></div>${gameBand()}`;
}
function fillArchive() {
  const target = document.querySelector('#conversation-results'); if (!target) return;
  const filtered=conversations.filter(c=>(archiveFilter==='All'||c.type===archiveFilter)&&`${c.title} ${c.description}`.toLowerCase().includes(archiveSearch.toLowerCase()));
  target.innerHTML=filtered.length?filtered.map(conversationCard).join(''):'<div class="empty-state"><h3>NO MATCHING CONVERSATIONS.</h3><p>Try another word or choose All.</p></div>';
}

function conversationPage(id) {
  const c=conversations.find(x=>x.id===id); if (!c) return notFound();
  return `<div class="container"><a class="article-back" href="#/conversations">← THE CONVERSATIONS</a><div class="page-heading"><span class="eyebrow">${c.type.toUpperCase()} · ${c.topic.toUpperCase()}</span><h1>${esc(c.title)}</h1><p>${c.description}</p></div><figure class="conversation-detail-image">${photoButton(c.photo)}</figure><div class="article-layout"><article class="article-body"><h2>BRING IT TO THE TABLE.</h2><p>A conversation can start with a question. It can go somewhere none of us expected. These are a few places to begin.</p><ul class="discussion-questions">${c.questions.map(q=>`<li>${q}</li>`).join('')}</ul><a class="button black" href="#/wall?topic=${encodeURIComponent(c.topic)}">WHAT’S YOUR MAONI? <span>↗</span></a></article><aside class="article-aside"><span class="eyebrow">KEEP IT GOING</span><h3>HEAR SOMEONE<br>ELSE OUT.</h3><p>You don’t have to agree. Be curious. Give people room to finish. Challenge an idea without turning someone into a target.</p><a class="button pink" href="#/events">COME TO A MAONI <span>↗</span></a></aside></div></div>`;
}

function wallPage(params) {
  const t=params.get('topic'); if (topicList.includes(t)) wallTopic=t;
  return `<section class="wall-intro"><div class="container"><div class="page-heading page-head-row"><div><span class="eyebrow">OUR MAONI. YOURS TOO.</span><h1>THE<br>MAONI WALL<span style="color:var(--blue)">.</span></h1><p>Leave a thought. Start a disagreement. Ask a better question.<br>The conversation keeps going here.</p></div><button class="button black" data-action="open-post">DROP YOUR MAONI <span>↗</span></button></div></div></section><div class="container"><form id="wall-quick-form" class="wall-composer"><label for="quick-maoni" class="sr-only">Start your maoni</label><input id="quick-maoni" type="text" minlength="5" maxlength="400" required placeholder="Okay, hear me out…"><button class="button black" type="submit">LEAVE A MAONI <span>↗</span></button></form><div class="wall-controls"><div class="filters" aria-label="Filter wall by topic">${topicList.map(t=>`<button class="filter ${wallTopic===t?'active':''}" data-wall-filter="${esc(t)}" aria-pressed="${wallTopic===t}">${t}</button>`).join('')}</div><label class="sort-control">SORT BY <select id="wall-sort"><option value="newest" ${wallSort==='newest'?'selected':''}>Newest</option><option value="agreed" ${wallSort==='agreed'?'selected':''}>Most agreed</option></select></label></div><div id="wall-posts" class="wall-grid" aria-live="polite"><p>Loading the maoni…</p></div><section class="wall-prompts"><span class="eyebrow">A FEW QUESTIONS TO GET US STARTED · DISCUSSION PROMPTS</span><h2>ANYTHING TO ADD?</h2><div class="prompt-grid"><button class="prompt-card" data-prompt="Life &amp; community"><h3>Where do you go to find your people?</h3><span>WHAT’S YOUR MAONI? ↗</span></button><button class="prompt-card" data-prompt="Climate &amp; land"><h3>Who gets to decide what a greener city looks like?</h3><span>WHAT’S YOUR MAONI? ↗</span></button><button class="prompt-card" data-prompt="Identity &amp; culture"><h3>What does being African ask of us?</h3><span>WHAT’S YOUR MAONI? ↗</span></button></div></section></div>`;
}
async function wallApi(method='GET',data) {
  const response=await fetch('/api/wall',{method,headers:{'content-type':'application/json','x-maoni-visitor':visitorToken},...(data?{body:JSON.stringify(data)}:{})});
  const result=await response.json(); if (!response.ok) throw new Error(result.error||'Something went wrong. Please try again.'); return result;
}
async function loadWall() {
  const generation=renderGeneration;
  try {const result=await wallApi();if(currentPage!=='wall'||generation!==renderGeneration)return;wallPosts=result.posts;fillWall();}
  catch(error){const target=document.querySelector('#wall-posts');if(target&&generation===renderGeneration)target.innerHTML=`<div class="empty-state"><h3>THE WALL IS TAKING A MOMENT.</h3><p>${esc(error.message)}</p><button class="text-link text-button" data-action="refresh-wall">TRY AGAIN ↻</button></div>`;}
}
function fillWall() {
  const target=document.querySelector('#wall-posts');if(!target)return;
  let posts=wallPosts.filter(p=>wallTopic==='All'||p.topic===wallTopic);
  posts=[...posts].sort((a,b)=>wallSort==='agreed'?b.agreements-a.agreements||b.createdAt-a.createdAt:b.createdAt-a.createdAt);
  target.innerHTML=posts.length?posts.map(p=>`<article class="wall-note"><span class="eyebrow">${esc(p.topic)} · ${new Date(p.createdAt).toLocaleDateString('en-KE',{day:'numeric',month:'short',timeZone:'Africa/Nairobi'})}</span><p class="opinion-text">${esc(p.text)}</p><span class="note-name">— ${esc(p.name)}</span><div class="note-actions"><button class="agree-button" data-agree="${esc(p.id)}" aria-pressed="${Boolean(p.agreed)}">${p.agreed?'AGREED':'I AGREE'} ↗ <span>${p.agreements}</span></button>${p.mine?`<button class="delete-post" data-delete-post="${esc(p.id)}">Remove mine</button>`:''}</div></article>`).join(''):`<div class="empty-state"><span class="eyebrow">THERE’S SPACE FOR YOU HERE.</span><h3 style="margin-top:18px">${wallPosts.length?'NO MAONI IN THIS TOPIC YET.':'A NEW WALL. YOUR FIRST WORD.'}</h3><p>Be the first to put a maoni here.</p><button class="button black" style="margin-top:23px" data-action="open-post">PIN YOUR MAONI <span>↗</span></button></div>`;
}

function essaysPage() {
  return `<div class="container"><div class="page-heading"><span class="eyebrow">READ. QUESTION. COME BACK WITH A MAONI.</span><h1>THE <span class="marker blue-marker">ESSAYS.</span></h1><div class="scribble-line" aria-hidden="true"></div><p>A little more room for the things we’re talking about.<br>Essays, questions and the sources behind them.</p></div><div class="essay-grid">${essays.map(essayCard).join('')}</div><div class="editorial-note"><h3>FOLLOW<br>THE SOURCES.</h3><p>Every essay links to its sources. Research findings and questions for discussion are kept clear. These first reading pieces are starting points for a conversation, open to challenge and further reading.</p></div></div>${gameBand()}`;
}
function essayPage(id) {
  const e=essays.find(x=>x.id===id);if(!e)return notFound();
  return `<div class="container"><a class="article-back" href="#/essays">← THE ESSAYS</a><div class="page-heading"><span class="eyebrow">${e.label} · ${e.time} · READING DESK</span><h1>${esc(e.title)}</h1><p>${e.summary}</p></div><div class="article-layout"><article class="article-body">${e.body}<section class="source-list"><span class="eyebrow">SOURCES & FURTHER READING</span><ol>${e.sources.map(s=>`<li id="source-${s.id}"><a href="${s.url}" target="_blank" rel="noopener">${s.title} ↗</a><br>${s.note}</li>`).join('')}</ol></section><div class="browse-row"><button class="text-link text-button" data-action="share-page">SHARE THIS ESSAY ↗</button></div></article><aside class="article-aside"><span class="eyebrow">WHAT DO YOU THINK?</span><h3>THE ESSAY<br>IS A START.</h3><p>Something to add? Something you disagree with? Take it to the Wall.</p><a class="button pink" href="#/wall?topic=Climate%20%26%20land">ADD YOUR MAONI <span>↗</span></a></aside></div></div>`;
}

function communityPage() {
  return `<div class="container"><section class="community-intro"><div class="page-heading"><span class="eyebrow">THE PEOPLE MAKE MAONI.</span><h1>COME FOR THE<br>CONVERSATION.<br><span class="marker">STAY FOR<br>THE PEOPLE.</span></h1><div class="scribble-line" aria-hidden="true"></div><p>A discussion club and third space in Nairobi. A place to make friends, play games, share a hot take and hear someone else out.</p><button class="film-button" data-action="open-film">▶ WATCH THE MAONI INTRO</button></div><figure class="polaroid">${photoButton(7)}<figcaption>THESE ARE OUR PEOPLE.</figcaption></figure></section><div class="community-principles"><article><span>01 / SHOW UP</span><h3>COME AS YOU ARE.</h3><p>You can come alone or with friends. There’s room to meet people and find your table.</p></article><article><span>02 / HEAR EACH OTHER</span><h3>DISAGREEMENT IS WELCOME.</h3><p>Be curious about someone else’s perspective. Give them room to finish. Bring your own.</p></article><article><span>03 / KEEP COMING BACK</span><h3>MAKE IT A COMMUNITY.</h3><p>Opinion nights. Trivia nights. Games and conversations that carry on beyond one evening.</p></article></div><div class="section-title"><div><span class="eyebrow">FROM OUR MAONI NIGHTS</span><h2>THE PEOPLE.<br>THE <span class="marker lime-marker">MOMENTS.</span></h2></div><p>Real conversations. Very real reactions.<br>Tap any photo to open the original.</p></div><div class="photo-grid">${photos.map((p,i)=>`<figure class="gallery-photo">${photoButton(i)}<figcaption>${p.caption}</figcaption></figure>`).join('')}</div><section class="community-join"><h2>THERE’S A SEAT<br><span class="marker">FOR YOU.</span></h2><div><p>Come for the next Maoni. Bring a friend or make one here. Even if you can’t make it, you can still leave your hot take on the Wall.</p><a class="button black" href="#/events">COME TO A MAONI <span>↗</span></a><div style="margin-top:15px"><a class="text-link" href="#/wall">LEAVE YOUR HOT TAKE ↗</a></div></div></section></div>${gameBand()}`;
}

function eventsPage() {
  const past=Date.now()>Date.parse('2026-11-06T23:00:00+03:00');
  return `<div class="container"><div class="page-heading events-intro"><span class="eyebrow">LET’S GET TOGETHER.</span><h1>SEE YOU AT<br><span class="marker">MAONI.</span></h1><p>Good conversations, games, hot takes and healthy disagreement.</p></div><section class="event-detail"><div class="event-poster"><span class="eyebrow">${past?'RECENT OPINION NIGHT':'NEXT OPINION NIGHT'} · A DISCUSSION CLUB BY KATA FORM</span><h2>IT’S<br>GETTING<br>HOT IN<br>HERE!</h2><p class="handwritten">The African Climate</p><div class="event-meta"><span>FRIDAY, 6 NOVEMBER 2026</span><span>HILLPARK HOTEL · NAIROBI</span></div></div><div class="event-info"><h3>WHAT’S YOUR MAONI?</h3><p>What does climate change look like for us in Nairobi and across Africa? Bring your questions, your ideas and your hot takes. We’re making room for the conversation.</p><p>Come alone or bring your people. You don’t need to be an expert to join in.</p><div class="booking-box"><span class="eyebrow">${past?'THIS EVENT HAS PASSED':'TICKETS · HUSTLESASA'}</span><h3 style="font-size:31px">${past?'KEEP THE CONVERSATION GOING.':'COME THROUGH.'}</h3><p>${past?'Find the essays or leave your maoni on the Wall.':'Tickets are sold through HustleSasa. The direct Maoni booking link is still to be added here.'}</p>${past?'<a class="button black" href="#/wall">THE MAONI WALL <span>↗</span></a>':'<a class="button black" href="https://hustlesasa.com/" target="_blank" rel="noopener">OPEN HUSTLESASA <span>↗</span></a>'}</div><div class="event-small-actions"><a class="text-link" href="https://www.google.com/maps/search/?api=1&query=Hillpark+Hotel+Lower+Hill+Road+Nairobi" target="_blank" rel="noopener">FIND HILLPARK ↗</a><button class="text-link text-button" data-action="calendar">SAVE THE DATE ↓</button><button class="text-link text-button" data-action="share-page">BRING A FRIEND ↗</button></div><figure class="up-next-photo" style="margin-top:30px">${photoButton(1)}<figcaption>THERE’S ALWAYS SOMETHING TO TALK ABOUT.</figcaption></figure></div></section><section class="event-faq"><span class="eyebrow">BEFORE YOU COME THROUGH</span><h2 style="margin-top:15px">A FEW THINGS.</h2><details><summary>Can I come alone?</summary><p>Yes. Maoni is a third space for meeting people. Come alone, with a friend or with your group.</p></details><details><summary>Do I need to know everything about the topic?</summary><p>No. Bring your questions and your perspective. We’re here for open conversation, games and healthy disagreement.</p></details><details><summary>What if I can’t make it?</summary><p>You can still read the essays and leave a maoni on the Wall. The conversation stays open.</p></details><details><summary>Is this the same as the Maoni game?</summary><p>Maoni is also a card game. You can play it on the separate game website, using one device or joining a room with a code.</p><div style="margin-top:16px">${gameLink('OPEN THE GAME','text-link')}</div></details></section><section class="next-event"><div><span class="eyebrow">NEXT ANNOUNCED TRIVIA NIGHT</span><h3>MAONI × QUIZ DRAMA</h3><p>Friday, 20 November 2026.<br>Venue and ticket details to follow.</p></div><span>20<br>NOV</span></section></div>${gameBand()}`;
}
function notFound() {return `<div class="section empty-state" style="margin:70px auto"><h1 style="font-size:70px">LOST YOUR MAONI?</h1><p style="margin:25px 0">That page isn’t here. Let’s get you back to the conversation.</p><a class="button black" href="#/">GO HOME <span>↗</span></a></div>`;}

function render() {
  renderGeneration++;
  const raw=(location.hash||'#/').slice(1);
  const [path,query='']=raw.split('?');
  const parts=path.split('/').filter(Boolean);
  const route=parts[0]||'home';
  const params=new URLSearchParams(query);
  currentPage=route;
  let content;
  if(route==='home')content=home();
  else if(route==='conversations')content=conversationsPage();
  else if(route==='conversation')content=conversationPage(parts[1]);
  else if(route==='wall')content=wallPage(params);
  else if(route==='essays')content=essaysPage();
  else if(route==='essay')content=essayPage(parts[1]);
  else if(route==='community')content=communityPage();
  else if(route==='events')content=eventsPage();
  else content=notFound();
  main.innerHTML=content;
  main.dataset.page=route;
  syncDesktop(route);
  document.querySelector('#wall-quick-form')?.addEventListener('submit',handleQuickPost);
  const navRoute=route==='conversation'?'conversations':route==='essay'?'essays':route;
  document.querySelectorAll('[data-nav]').forEach(a=>{const active=a.dataset.nav===navRoute;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  document.querySelector('#main-nav').classList.remove('open');
  document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');
  document.title=route==='home'?'home — Maoni':`${route==='essay'?(essays.find(e=>e.id===parts[1])?.title||'The Essays'):route==='conversation'?(conversations.find(c=>c.id===parts[1])?.title||'The Conversations'):({wall:'the maoni wall',conversations:'the conversations',essays:'our maoni',community:'the community',events:'See You at Maoni'}[route]||'Maoni')} — Maoni`;
  if(route==='conversations')fillArchive();
  if(route==='wall')loadWall();
  window.scrollTo({top:0,behavior:'instant'});
  if(renderGeneration>1&&!document.activeElement?.matches('[data-personal-note]'))main.focus({preventScroll:true});
}
function toast(message) {const target=document.querySelector('#toast');target.textContent=message;target.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>target.classList.remove('show'),4000);}
function openPost(topic) {if(topic&&topicList.includes(topic)&&topic!=='All')document.querySelector('#post-topic').value=topic;else if(wallTopic!=='All')document.querySelector('#post-topic').value=wallTopic;document.querySelector('#post-status').textContent='';document.querySelector('#post-dialog').showModal();}
function handleQuickPost(event) {event.preventDefault();const value=event.currentTarget.querySelector('input').value.trim();document.querySelector('#post-text').value=value;document.querySelector('#character-count').textContent=`${value.length} / 400`;openPost();}
function openPhoto(index) {photoIndex=(index+photos.length)%photos.length;const p=photos[photoIndex];document.querySelector('#full-photo').src=`/assets/${p.file}`;document.querySelector('#full-photo').alt=p.alt;document.querySelector('#photo-caption').textContent=`${photoIndex+1} / ${photos.length} · ${p.caption}`;const dialog=document.querySelector('#photo-dialog');if(!dialog.open)dialog.showModal();}

document.addEventListener('click',async event=>{
  const target=event.target.closest('button,a');if(!target)return;
  if(target.matches('[data-close]'))target.closest('dialog').close();
  if(target.dataset.photo!==undefined)openPhoto(Number(target.dataset.photo));
  if(target.dataset.archiveFilter){archiveFilter=target.dataset.archiveFilter;document.querySelectorAll('[data-archive-filter]').forEach(b=>{const active=b.dataset.archiveFilter===archiveFilter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});fillArchive();}
  if(target.dataset.wallFilter){wallTopic=target.dataset.wallFilter;document.querySelectorAll('[data-wall-filter]').forEach(b=>{const active=b.dataset.wallFilter===wallTopic;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});fillWall();}
  if(target.dataset.prompt)openPost(target.dataset.prompt);
  if(target.dataset.agree){target.disabled=true;try{const result=await wallApi('PATCH',{id:target.dataset.agree});const post=wallPosts.find(p=>p.id===target.dataset.agree);Object.assign(post,result);fillWall();}catch(error){toast(error.message);target.disabled=false;}}
  if(target.dataset.deletePost){target.disabled=true;try{await wallApi('DELETE',{id:target.dataset.deletePost});wallPosts=wallPosts.filter(p=>p.id!==target.dataset.deletePost);fillWall();toast('Your maoni has been removed.');}catch(error){toast(error.message);target.disabled=false;}}
  const action=target.dataset.action;
  if(action==='open-post')openPost();
  if(action==='refresh-wall')loadWall();
  if(action==='privacy')document.querySelector('#info-dialog').showModal();
  if(action==='next-photo')openPhoto(photoIndex+1);
  if(action==='previous-photo')openPhoto(photoIndex-1);
  if(action==='open-film'){document.querySelector('#film-dialog').showModal();document.querySelector('#maoni-film').play().catch(()=>{});}
  if(action==='share-page'){try{if(navigator.share)await navigator.share({title:document.title,url:location.href});else{await navigator.clipboard.writeText(location.href);toast('Link copied. Send it to your people.');}}catch(error){if(error.name!=='AbortError')toast('You can copy this page’s address to share it.');}}
  if(action==='calendar'){
    const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Maoni//Community//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:maoni-20261106@maoni-community.fastcord1.chatgpt.site','DTSTAMP:20261102T120000Z','DTSTART;VALUE=DATE:20261106','DTEND;VALUE=DATE:20261107','SUMMARY:Maoni — It’s Getting Hot in Here','LOCATION:Hillpark Hotel\, Nairobi','DESCRIPTION:The African Climate. Confirm event time and tickets with the organiser.','END:VEVENT','END:VCALENDAR'].join('\r\n');
    const blob=new Blob([ics],{type:'text/calendar;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='Maoni-6-November-2026.ics';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Date saved. Confirm the event time when booking.');
  }
});
document.querySelector('.menu-toggle').addEventListener('click',()=>{const open=document.querySelector('#main-nav').classList.toggle('open');document.querySelector('.menu-toggle').setAttribute('aria-expanded',open);});
document.addEventListener('input',event=>{if(event.target.id==='conversation-search'){archiveSearch=event.target.value;fillArchive();}if(event.target.id==='post-text')document.querySelector('#character-count').textContent=`${event.target.value.length} / 400`;});
document.addEventListener('change',event=>{if(event.target.id==='wall-sort'){wallSort=event.target.value;fillWall();}});
document.querySelector('#post-form').addEventListener('submit',async event=>{
  event.preventDefault();const form=event.target;const submit=form.querySelector('[type=submit]');const status=document.querySelector('#post-status');submit.disabled=true;status.textContent='Pinning your maoni…';
  try{await wallApi('POST',{name:form.elements.name.value,text:form.elements.text.value,topic:form.elements.topic.value,consent:form.elements.consent.checked});wallTopic='All';form.reset();document.querySelector('#wall-quick-form')?.reset();document.querySelector('#character-count').textContent='0 / 400';document.querySelector('#post-dialog').close();toast('Your maoni is on the Wall.');if(currentPage==='wall'){document.querySelectorAll('[data-wall-filter]').forEach(b=>{const active=b.dataset.wallFilter==='All';b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});loadWall();}else location.hash='#/wall';}
  catch(error){status.textContent=error.message;}finally{submit.disabled=false;}
});
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}));
document.querySelector('#film-dialog').addEventListener('close',()=>document.querySelector('#maoni-film').pause());
document.addEventListener('keydown',event=>{if(document.querySelector('#photo-dialog').open){if(event.key==='ArrowRight')openPhoto(photoIndex+1);if(event.key==='ArrowLeft')openPhoto(photoIndex-1);}});
document.addEventListener('click',event=>{const link=event.target.closest('a[href^="#source-"]');if(!link)return;event.preventDefault();document.querySelector(link.getAttribute('href'))?.scrollIntoView({behavior:'smooth',block:'start'});});
document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();main.focus();main.scrollIntoView({behavior:'instant'});});
window.addEventListener('hashchange',render);
render();
