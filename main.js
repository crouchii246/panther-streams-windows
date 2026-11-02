const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('node:path');

const SUPABASE = 'https://yjjrokhbapsehorfgnfz.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_VjFzBu44Dq2eBx5Ve76j5A_vQ4f8jTC';

function createWindow() {
  const window = new BrowserWindow({
    width: 1280, height: 820, minWidth: 820, minHeight: 620,
    backgroundColor: '#070f17', title: 'Panther Streams',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, sandbox: true, nodeIntegration: false,
      webSecurity: true
    }
  });
  window.removeMenu();
  window.loadFile('index.html');
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', event => event.preventDefault());
}

ipcMain.handle('panther:services', async () => {
  try {
    const response = await fetch(`${SUPABASE}/rest/v1/rpc/panther_get_services`, {
      method: 'POST',
      headers: { apikey: PUBLISHABLE_KEY, 'content-type': 'application/json', accept: 'application/json' },
      body: '{}', signal: AbortSignal.timeout(9000)
    });
    if (!response.ok) throw new Error(`Service list returned HTTP ${response.status}`);
    const data = await response.json();
    const rows = Array.isArray(data) ? data : Array.isArray(data?.services) ? data.services : [];
    return { ok: true, services: rows.filter(s => typeof s.provider_key === 'string' && typeof s.service_url === 'string').map(s => ({key: s.provider_key, name: s.display_name || s.provider_key, order: Number(s.sort_order) || 0})).sort((a,b)=>a.order-b.order) };
  } catch(error) { return { ok: false, error: 'Cannot load services from Panther Admin. Check your internet connection.' }; }
});
// HTTPS-only verification through the existing Panther Supabase Edge Function.
// The provider's HTTP endpoint is never contacted by this Windows build.
ipcMain.handle('panther:verify-login', async (_event, payload) => {
  const service = typeof payload?.service === 'string' ? payload.service.trim() : '';
  const username = typeof payload?.username === 'string' ? payload.username.trim() : '';
  const password = typeof payload?.password === 'string' ? payload.password : '';
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(service) || !username || !password || username.length > 256 || password.length > 256) {
    return { ok: false, message: 'Select a service and enter your username and password.' };
  }
  try {
    const response = await fetch(`${SUPABASE}/functions/v1/panther-web-auth`, {
      method: 'POST',
      headers: { 'apikey': PUBLISHABLE_KEY, 'content-type': 'application/json', 'accept': 'application/json' },
      body: JSON.stringify({ service, username, password }),
      redirect: 'error',
      signal: AbortSignal.timeout(15000)
    });
    // Never expose raw provider responses, auth tokens or HTTP response bodies to the renderer.
    if (response.status === 503) return { ok: false, message: 'This provider does not currently support secure web verification. Ask your provider for an HTTPS API endpoint.' };
    if (response.status === 401 || response.status === 403) return { ok: false, message: 'The credentials could not be verified. Check your details or contact support.' };
    if (response.status === 400) return { ok: false, message: 'The login service could not process this request.' };
    if (!response.ok) return { ok: false, message: `Secure login is unavailable (HTTP ${response.status}).` };
    const body = await response.json().catch(() => null);
    if (body && (body.ok === true || body.success === true || typeof body.token === 'string')) {
      return { ok: true, message: 'Credentials verified securely. Provider catalogue and playback are not yet connected in this preview.' };
    }
    return { ok: false, message: 'The login service returned an unrecognised response. Login was not completed.' };
  } catch {
    return { ok: false, message: 'Unable to reach the secure login service. Check your connection.' };
  }
});
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
