import { BrowserWindow, ipcMain, shell } from 'electron'
import { loadModules, MODULES_PATH, runModule } from './module-loader';
import {readLog, clearLog} from "./module-log"
import chokidar from 'chokidar';
import { autoUpdater } from 'electron-updater';

const watcher = chokidar.watch(MODULES_PATH, {
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 100 }
});

export function injectApi(window: BrowserWindow | null) {
    if(!window) return;
    ipcMain.handle('list-modules', async () => {
        return await loadModules(false);
    });

    ipcMain.handle('run-module', async (_event, name: string, data: any) => {
        const [success, _] = await runModule(window, name, data);
        return success;
    });


    ipcMain.handle('get-log', (_event, name: string) => {
        return readLog(name);
    });

    ipcMain.on('clear-log', (_event, name: string) => {
        clearLog(name);
        window.webContents.send(`log-update-${name}`);
    });



    ipcMain.handle('is-maximized', () => {
        return window.isMaximized();
    });

    ipcMain.on("open-modulefolder", () => {
        shell.openPath(MODULES_PATH);
    })
    
    ipcMain.on('close', () => {
        window.close();
    });

    ipcMain.on('minimize', () => {
        window.minimize();
    });

    ipcMain.on('toggle-maximize', () => {
        window.isMaximized() ? window.unmaximize() : window.maximize();
    });

    ipcMain.handle('get-module', async (_event, name: string) => {
        if(!name) return undefined;
        const [modules, _] = await loadModules(false);
        const module = modules.find(m => m.name === name);
        return module;
    });

    autoUpdater.on("update-available", (info) => {
        window.webContents.send("update-available", info);
    })

    watcher.on('add', async () => {
        window.webContents.send('module-updated');
    });

    watcher.on('change', async () => {
        console.log('change');
        window.webContents.send('module-updated');
    });

    watcher.on('unlink', async () => {
        window.webContents.send('module-updated');
    });
    

}

export function sendLog(window: BrowserWindow | null, ...args: any[]) {
    window?.webContents.send('log', args);
}