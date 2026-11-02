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
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
