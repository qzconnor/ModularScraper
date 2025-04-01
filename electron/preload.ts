import { ipcRenderer, contextBridge } from 'electron'


export const API = {
  getModule: (name?: string) => ipcRenderer.invoke('get-module', name),
  getModules: () => ipcRenderer.invoke('list-modules'),
  runModule: (name: string, data: any) => ipcRenderer.invoke('run-module', name, data),
  toggleMaximize: () => ipcRenderer.send('toggle-maximize'),
  close: () => ipcRenderer.send('close'),
  isMaximized: (): Promise<boolean> => ipcRenderer.invoke('is-maximized'),
  minimize: () => ipcRenderer.send('minimize'),
  openModuleFolder: () => ipcRenderer.send('open-modulefolder'),


  onModuleUpdated: (listener: () => Promise<void>) => ipcRenderer.on('module-updated', listener),

  getLog: (name: string) => ipcRenderer.invoke('get-log', name),
  clearLog: (name: string) => ipcRenderer.send('clear-log', name),
  onLogUpdated: (name: string, listener: () => Promise<void>) => ipcRenderer.on('log-update-' + name, listener),
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