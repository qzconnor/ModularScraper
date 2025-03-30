import path from 'node:path'
import store from './singelton/store';
import * as fs from 'node:fs';
import { BrowserWindow, ipcMain } from 'electron'

export const MODULES_PATH = path.join(path.dirname(store.path), 'modules');

export function ensureModulePath() {
    if(!fs.existsSync(MODULES_PATH)) {
        fs.mkdirSync(MODULES_PATH);
      }
}

export function listModules() {
    return fs.readdirSync(MODULES_PATH);
}

export function injectApi(window: BrowserWindow | null) {
    if(!window) return;
    ipcMain.handle('list-modules', () => {
        return listModules();
    });

    ipcMain.handle('is-maximized', () => {
        return window.isMaximized();
    });
    
    ipcMain.on('close', () => {
        window.close();
    });

    ipcMain.on('minimize', () => {
        window.minimize();
    });

    ipcMain.on('toggle-maximize', () => {
        window.isMaximized() ? window.unmaximize() : window.maximize();
    });
}