// Предназначен для безопасного взаимодействия между рендерером и Node
const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('electronApi', {
  version: () => process.versions
});
