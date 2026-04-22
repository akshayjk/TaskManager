const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    ping: () => ipcRenderer.invoke('ping'),
    getAll: () => ipcRenderer.invoke('db:get-all'),
    addTask: (task) => ipcRenderer.invoke('db:add-task', task),
    updateTask: (id, updates) => ipcRenderer.invoke('db:update-task', { id, updates }),
    saveSettings: (settings) => ipcRenderer.invoke('db:save-settings', settings)
});
