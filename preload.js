const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('panther', Object.freeze({
  loadServices: () => ipcRenderer.invoke('panther:services'),
  verifyLogin: (credentials) => ipcRenderer.invoke('panther:verify-login', credentials),
  runDiagnostics: () => ipcRenderer.invoke('panther:diagnostics')
}));
