const $ = id => document.getElementById(id);
const names = { 'Live TV':'Your IPTV channels and programme guide will appear here after account authentication is integrated.', Movies:'Your provider movie catalogue will appear here.', Series:'Your provider series and episodes will appear here.', Favourites:'Your saved titles will appear here after profile sync is connected.', 'Continue Watching':'Your viewing progress will appear here after profile sync is connected.', 'Panther Support':'Support messaging will appear here once account linking is ready.' };
async function loadServices() {
  const result = await window.panther.loadServices();
  const select = $('provider'); select.replaceChildren();
  const placeholder = document.createElement('option'); placeholder.value=''; placeholder.textContent='Select your service'; select.append(placeholder);
  if (result.ok) result.services.forEach(s=>{const option=document.createElement('option');option.value=s.key;option.textContent=s.name;select.append(option);});
  else $('service-error').textContent = result.error;
}
function go(page){ $('page-title').textContent=page; $('home').classList.toggle('hidden',page!=='Home'); $('placeholder').classList.toggle('hidden',page==='Home');if(page!=='Home'){$('placeholder-title').textContent=page;$('placeholder-desc').textContent=names[page]||'';}document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page)); }
$('toggle-password').addEventListener('click',()=>{$('password').type=$('password').type==='password'?'text':'password';$('toggle-password').textContent=$('password').type==='password'?'Show':'Hide';});
$('sign-in').addEventListener('click',()=>{$('notice').textContent='This starter build does not authenticate accounts. Please use Explore Demo; no password has been transmitted.';});
$('demo').addEventListener('click',()=>{$('username').value='';$('password').value='';$('entry').classList.add('hidden');$('app').classList.remove('hidden');go('Home');});
$('back').addEventListener('click',()=>{$('app').classList.add('hidden');$('entry').classList.remove('hidden');$('password').value='';});
$('explore').addEventListener('click',()=>go('Live TV'));
$('return-home').addEventListener('click',()=>go('Home'));
document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.page)));
loadServices();
