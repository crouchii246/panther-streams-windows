const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('panther', Object.freeze({
  loadServices: () => ipcRenderer.invoke('panther:services')
}));
