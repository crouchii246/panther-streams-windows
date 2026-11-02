const $ = id => document.getElementById(id);
const names = { 'Live TV':'Your IPTV channels and programme guide will appear here after account authentication is integrated.', Movies:'Your provider movie catalogue will appear here.', Series:'Your provider series and episodes will appear here.', Favourites:'Your saved titles will appear here after profile sync is connected.', 'Continue Watching':'Your viewing progress will appear here after profile sync is connected.', 'Panther Support':'Support messaging will appear here once account linking is ready.' };
async function loadServices() {
  const result = await window.panther.loadServices();
  const select = $('provider'); select.replaceChildren();
  const placeholder = document.createElement('option'); placeholder.value=''; placeholder.textContent='Select your service'; select.append(placeholder);
  if (result.ok) result.services.forEach(s=>{const option=document.createElement('option');option.value=s.key;option.textContent=s.name;select.append(option);});
  else $('service-error').textContent = result.error;
}
function go(page){
  $('page-title').textContent=page;
  $('home').classList.toggle('hidden',page!=='Home');
  $('live').classList.toggle('hidden',page!=='Live TV');
  $('catalogue').classList.toggle('hidden',!['Movies','Series','Favourites'].includes(page));
  $('placeholder').classList.toggle('hidden',!['Continue Watching','Panther Support'].includes(page));
  $('diagnostics').classList.toggle('hidden',page!=='System Test');
  $('placeholder-title').textContent=page;
  $('placeholder-desc').textContent=names[page]||'';
  document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  if(['Movies','Series','Favourites'].includes(page)) drawCatalogue(page);
}
$('toggle-password').addEventListener('click',()=>{$('password').type=$('password').type==='password'?'text':'password';$('toggle-password').textContent=$('password').type==='password'?'Show':'Hide';});
let verifyingLogin = false;
async function attemptLogin(){
  if (verifyingLogin) return;
  const service = $('provider').value, username = $('username').value.trim(), password = $('password').value;
  if (!service || !username || !password) { $('notice').textContent = 'Select a service and enter your username and password.'; return; }
  verifyingLogin = true; $('sign-in').disabled = true; $('notice').textContent = 'Checking secure account access…';
  try {
    const result = await window.panther.verifyLogin({service, username, password});
    $('notice').textContent = result && typeof result.message === 'string' ? result.message : 'Login could not be completed.';
  } catch { $('notice').textContent = 'The secure login service could not be reached.'; }
  finally { $('password').value = ''; verifyingLogin = false; $('sign-in').disabled = false; }
}
$('sign-in').addEventListener('click',attemptLogin);
$('password').addEventListener('keydown',event=>{if(event.key==='Enter')attemptLogin();});
$('demo').addEventListener('click',()=>{$('username').value='';$('password').value='';$('entry').classList.add('hidden');$('app').classList.remove('hidden');go('Home');});
$('back').addEventListener('click',()=>{$('app').classList.add('hidden');$('entry').classList.remove('hidden');$('password').value='';});
$('explore').addEventListener('click',()=>go('Live TV'));
$('return-home').addEventListener('click',()=>go('Home'));
document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.page)));
loadServices();

// Deliberately fictional guide data: no IPTV credentials, remote streams or API endpoints.
const demoChannels = [
  {id:'01', name:'Panther News',category:'News',now:'Headlines Today',next:'World Report'},
  {id:'02', name:'Panther Sports',category:'Sport',now:'Matchday Review',next:'Sports Desk'},
  {id:'03', name:'Panther Cinema',category:'Entertainment',now:'Movie Spotlight',next:'Behind the Scenes'},
  {id:'04', name:'Panther Nature',category:'Documentaries',now:'Wild Earth',next:'Ocean Discoveries'},
  {id:'05', name:'Panther Kids',category:'Family',now:'Adventure Club',next:'Story Time'},
  {id:'06', name:'Panther Music',category:'Entertainment',now:'Fresh Tracks',next:'Classic Hits'},
  {id:'07', name:'Panther Science',category:'Documentaries',now:'The Cosmos',next:'Future Worlds'},
  {id:'08', name:'Panther World',category:'News',now:'Across the Globe',next:'Evening Update'}
];
let selectedChannel = demoChannels[0];
function drawLive(){
  const q=$('live-search').value.trim().toLowerCase(), cat=$('live-category').value;
  const filtered=demoChannels.filter(c=>(cat==='All'||c.category===cat)&&[c.name,c.now,c.next].some(t=>t.toLowerCase().includes(q)));
  $('live-count').textContent=`${filtered.length} SAMPLE CHANNEL${filtered.length===1?'':'S'}`;
  const list=$('live-channels');list.replaceChildren();
  if(!filtered.length){const empty=document.createElement('p');empty.className='empty-channels';empty.textContent='No matching sample channels';list.append(empty);}
  for(const c of filtered){
    const b=document.createElement('button');b.className='channel'+(selectedChannel.id===c.id?' selected':'');
    b.type='button';b.setAttribute('aria-pressed',String(selectedChannel.id===c.id));
    const n=document.createElement('span');n.className='channel-number';n.textContent=c.id;
    const details=document.createElement('span');details.className='channel-details';
    const name=document.createElement('strong');name.textContent=c.name;
    const program=document.createElement('small');program.textContent=c.now;
    details.append(name,program);b.append(n,details);
    b.addEventListener('click',()=>{selectedChannel=c;drawLive();});list.append(b);
  }
  $('player-name').textContent=selectedChannel.name;
  const guide=$('live-guide');guide.replaceChildren();
  for(const [label,title] of [['NOW • EXAMPLE',selectedChannel.now],['NEXT • EXAMPLE',selectedChannel.next]]){
    const row=document.createElement('div');row.className='guide-row';
    const t=document.createElement('span');t.textContent=label;
    const s=document.createElement('strong');s.textContent=title;
    row.append(t,s);guide.append(row);
  }
}
for(const category of [...new Set(demoChannels.map(c=>c.category))].sort()){
  const opt=document.createElement('option');opt.value=category;opt.textContent=category;$('live-category').append(opt);
}
$('live-search').addEventListener('input',drawLive);
$('live-category').addEventListener('change',drawLive);
drawLive();


// Fully fictional interface data. Never mistake these items for genuine provider content.
const demoTitles = [
  {id:'m1',type:'Movies',title:'The Last Horizon',year:2025,genre:'Sci-Fi',rating:'12',description:'An explorer follows a mysterious signal beyond the edge of the mapped stars.',color:'#1b7084'},
  {id:'m2',type:'Movies',title:'Midnight Expressway',year:2024,genre:'Action',rating:'15',description:'A courier must race across a futuristic city before sunrise.',color:'#825b32'},
  {id:'m3',type:'Movies',title:'Hidden Valley',year:2023,genre:'Adventure',rating:'PG',description:'A family discovers an extraordinary secret in the mountains.',color:'#306d57'},
  {id:'m4',type:'Movies',title:'Echoes of Tomorrow',year:2026,genre:'Drama',rating:'12',description:'A scientist receives messages she seemingly sent years in the future.',color:'#6c4387'},
  {id:'m5',type:'Movies',title:'Ocean Light',year:2022,genre:'Documentary',rating:'U',description:'An illustrated journey through the wonders of the deep sea.',color:'#14658a'},
  {id:'m6',type:'Movies',title:'The Clockmaker',year:2025,genre:'Mystery',rating:'PG',description:'An apprentice uncovers clues in a town where time has stopped.',color:'#7b5644'},
  {id:'s1',type:'Series',title:'Northern Skies',year:2026,genre:'Drama',rating:'12',seasons:[4,3],description:'Secrets begin to surface in a remote coastal village.',color:'#225a78'},
  {id:'s2',type:'Series',title:'Code Zero',year:2025,genre:'Sci-Fi',rating:'12',seasons:[5,5,2],description:'An engineering team investigates an impossible digital anomaly.',color:'#1f6c65'},
  {id:'s3',type:'Series',title:'Wild Frontier',year:2024,genre:'Documentary',rating:'U',seasons:[4],description:'Expeditions to the world’s most remarkable habitats.',color:'#536f36'},
  {id:'s4',type:'Series',title:'Harbour Street',year:2025,genre:'Mystery',rating:'15',seasons:[6,4],description:'A detective searches for answers among an old port town’s residents.',color:'#6c526d'},
  {id:'s5',type:'Series',title:'Arcade Adventures',year:2023,genre:'Family',rating:'PG',seasons:[6,6],description:'Friends enter the world of a mysterious vintage arcade.',color:'#89516c'}
];
let cataloguePage='Movies'; let selectedTitle=null;
let favourites=new Set();
try { const saved=JSON.parse(localStorage.getItem('panther-demo-favourites')||'[]'); if(Array.isArray(saved)) favourites=new Set(saved.filter(v=>typeof v==='string')); }catch(e){}
function persistDemoFavourites(){try{localStorage.setItem('panther-demo-favourites',JSON.stringify([...favourites]));}catch(e){}}
function drawCatalogue(page=cataloguePage){
  const switched=cataloguePage!==page;cataloguePage=page;
  if(switched){$('catalogue-search').value='';$('catalogue-sort').value='title';selectedTitle=null;}
  $('catalogue-heading').textContent=page==='Favourites'?'Your demo favourites':page;
  $('catalogue-description').textContent='Sample titles for testing the Windows interface — no IPTV data or playback is connected.';
  const items=demoTitles.filter(t=>page==='Favourites'?favourites.has(t.id):t.type===page);
  const genres=[...new Set(items.map(t=>t.genre))].sort(), filter=$('catalogue-category');
  const previous=switched?'All':filter.value;filter.replaceChildren();
  for(const genre of ['All',...genres]){const opt=document.createElement('option');opt.value=genre;opt.textContent=genre==='All'?'All genres':genre;filter.append(opt);}
  filter.value=genres.includes(previous)?previous:'All';
  const q=$('catalogue-search').value.toLowerCase().trim();
  const filtered=items.filter(t=>(filter.value==='All'||filter.value===t.genre)&&[t.title,t.genre,t.description].some(s=>s.toLowerCase().includes(q)));
  filtered.sort((a,b)=>$('catalogue-sort').value==='year'?b.year-a.year:a.title.localeCompare(b.title));
  $('catalogue-count').textContent=`${filtered.length} SAMPLE TITLE${filtered.length===1?'':'S'}`;
  const grid=$('catalogue-grid');grid.replaceChildren();
  if(!filtered.length){const empty=document.createElement('p');empty.className='empty-channels';empty.textContent=page==='Favourites'?'No demo favourites yet. Add one from Movies or Series.':'No matching demonstration titles.';grid.append(empty);}
  for(const item of filtered){
    const card=document.createElement('button');card.type='button';card.className='poster-card'+(item.id===selectedTitle?' selected':'');
    const poster=document.createElement('div');poster.className='poster-art';poster.style.background=`linear-gradient(150deg,${item.color},#06141c)`;
    const symbol=document.createElement('span');symbol.textContent=item.type==='Series'?'▦':'▶';poster.append(symbol);
    if(favourites.has(item.id)){const star=document.createElement('b');star.className='poster-star';star.textContent='♥';poster.append(star);}
    const name=document.createElement('strong');name.textContent=item.title;
    const sub=document.createElement('small');sub.textContent=`${item.year} • ${item.genre}`;card.append(poster,name,sub);
    card.addEventListener('click',()=>{selectedTitle=item.id;drawCatalogue(page);});grid.append(card);
  }
  const chosen=demoTitles.find(t=>t.id===selectedTitle&&items.includes(t))||filtered[0];
  if(chosen)selectedTitle=chosen.id;else selectedTitle=null;
  const detail=$('catalogue-details');detail.replaceChildren();
  if(!chosen){const p=document.createElement('p');p.textContent='Select a sample title to view details.';detail.append(p);return;}
  const cover=document.createElement('div');cover.className='detail-cover';cover.style.background=`linear-gradient(120deg,${chosen.color},#07151f)`;cover.textContent=chosen.type==='Series'?'▦':'▶';
  const header=document.createElement('div');header.className='eyebrow';header.textContent=`SAMPLE ${chosen.type==='Series'?'SERIES':'MOVIE'} • ${chosen.rating}`;
  const title=document.createElement('h3');title.textContent=chosen.title;
  const meta=document.createElement('p');meta.className='detail-meta';meta.textContent=`${chosen.year} • ${chosen.genre}`;
  const desc=document.createElement('p');desc.textContent=chosen.description;
  const fav=document.createElement('button');fav.className='secondary';fav.textContent=favourites.has(chosen.id)?'♥ Remove demo favourite':'♡ Add demo favourite';
  fav.addEventListener('click',()=>{if(favourites.has(chosen.id))favourites.delete(chosen.id);else favourites.add(chosen.id);persistDemoFavourites();drawCatalogue(page);});
  const note=document.createElement('p');note.className='detail-meta';note.textContent='Preview only — video playback and provider content are not enabled.';
  detail.append(cover,header,title,meta,desc,fav);
  if(chosen.seasons){
    const heading=document.createElement('h4');heading.textContent='Sample episodes';detail.append(heading);
    const season=document.createElement('select');season.setAttribute('aria-label','Select season');
    chosen.seasons.forEach((_,i)=>{const opt=document.createElement('option');opt.value=String(i);opt.textContent=`Season ${i+1}`;season.append(opt);});
    const episodes=document.createElement('div');episodes.className='episode-list';
    const drawEpisodes=()=>{episodes.replaceChildren();const n=chosen.seasons[Number(season.value)];for(let i=1;i<=n;i++){
      const btn=document.createElement('button');btn.type='button';btn.textContent=`Episode ${i} — Preview details`;
      btn.addEventListener('click',()=>{note.textContent=`Season ${Number(season.value)+1}, Episode ${i} selected. Playback is not connected.`;});episodes.append(btn);
    }};season.addEventListener('change',drawEpisodes);drawEpisodes();detail.append(season,episodes);
  }
  detail.append(note);
}
$('catalogue-search').addEventListener('input',()=>drawCatalogue());
$('catalogue-category').addEventListener('change',()=>drawCatalogue());
$('catalogue-sort').addEventListener('change',()=>drawCatalogue());

// v0.5.0 safe diagnostic display: results use textContent rather than HTML.
let testing = false;
$('run-tests').addEventListener('click',async()=>{
  if(testing)return;
  testing=true;
  $('run-tests').disabled=true;
  $('test-summary').textContent='Running local and network checks…';
  $('test-results').replaceChildren();
  try {
    const report=await window.panther.runDiagnostics();
    if(!report || !Array.isArray(report.checks)) throw new Error('Invalid response');
    for(const result of report.checks){
      const row=document.createElement('div');row.className='test-result';
      const symbol=document.createElement('span');symbol.className=result.ok?'test-pass':'test-info';symbol.textContent=result.ok?'✓':'•';
      const detail=document.createElement('div');
      const title=document.createElement('strong');title.textContent=String(result.label||'Check');
      const msg=document.createElement('small');msg.textContent=String(result.detail||'');
      detail.append(title,msg);row.append(symbol,detail);$('test-results').append(row);
    }
    const passed=report.checks.filter(c=>c.ok).length;
    $('test-summary').textContent=`${passed} of ${report.checks.length} checks reported available. See details below.`;
  }catch{
    $('test-summary').textContent='Diagnostics could not complete. The app may be offline or unable to reach its own backend.';
  }finally{testing=false;$('run-tests').disabled=false;}
});
