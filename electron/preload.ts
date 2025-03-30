import { ipcRenderer, contextBridge } from 'electron'


export const API = {
  getModules: () => ipcRenderer.invoke('list-modules'),
  toggleMaximize: () => ipcRenderer.send('toggle-maximize'),
  close: () => ipcRenderer.send('close'),
  isMaximized: (): Promise<boolean> => ipcRenderer.invoke('is-maximized'),
  minimize: () => ipcRenderer.send('minimize'),
}

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('api', API)
/*
on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },*/