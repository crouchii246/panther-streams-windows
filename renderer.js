const $ = id => document.getElementById(id);
const names = { 'Live TV':'Your IPTV channels and programme guide will appear here after account authentication is integrated.', Movies:'Your provider movie catalogue will appear here.', Series:'Your provider series and episodes will appear here.', Favourites:'Your saved titles will appear here after profile sync is connected.', 'Continue Watching':'Your viewing progress will appear here after profile sync is connected.', 'Panther Support':'Support messaging will appear here once account linking is ready.' };
async function loadServices() {
  const result = await window.panther.loadServices();
  const select = $('provider'); select.replaceChildren();
  const placeholder = document.createElement('option'); placeholder.value=''; placeholder.textContent='Select your service'; select.append(placeholder);
  if (result.ok) result.services.forEach(s=>{const option=document.createElement('option');option.value=s.key;option.textContent=s.name;select.append(option);});
  else $('service-error').textContent = result.error;
}
function go(page){ $('page-title').textContent=page; $('home').classList.toggle('hidden',page!=='Home'); $('placeholder').classList.toggle('hidden',page==='Home'||page==='Live TV');$('live').classList.toggle('hidden',page!=='Live TV');if(page!=='Home'){$('placeholder-title').textContent=page;$('placeholder-desc').textContent=names[page]||'';}document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page)); }
$('toggle-password').addEventListener('click',()=>{$('password').type=$('password').type==='password'?'text':'password';$('toggle-password').textContent=$('password').type==='password'?'Show':'Hide';});
$('sign-in').addEventListener('click',()=>{$('notice').textContent='This starter build does not authenticate accounts. Please use Explore Demo; no password has been transmitted.';});
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
