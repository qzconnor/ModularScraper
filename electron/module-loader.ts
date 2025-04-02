import path from 'node:path';
import store from './singelton/store';
import * as fs from 'node:fs';
import type { ModuleInstance } from '../sharedtypes';
import { pathToFileURL } from 'url';
import { BrowserWindow } from 'electron';
import {writeLog, clearLog} from "./module-log"
import { getInfoTiktok, downloadYoutube, downloadTiktok, openDialog, saveDialog, getInfoYoutube,  } from "./apis"

export const MODULES_PATH = path.join(path.dirname(store.path), 'modules');

export function ensureModulePath() {
    if (!fs.existsSync(MODULES_PATH)) {
        fs.mkdirSync(MODULES_PATH);
    }

    const icons = path.join(MODULES_PATH, 'icons');
    if (!fs.existsSync(icons)) {
        fs.mkdirSync(icons);
    }
}

export async function loadModules(withRunnable: boolean = true) {
    const files = fs.readdirSync(MODULES_PATH);
    const moduleFiles = files.filter(file => file.endsWith('.mjs'));
    const loadedModules: ModuleInstance[] = [];
    const errors: Error[] = [];
    for (const file of moduleFiles) {
        const moduleURL = pathToFileURL(path.join(MODULES_PATH, file)).href;
        try {
            const instance = await import(moduleURL);
            if(!instance.default) {
                errors.push(new Error(`Module ${file} does not have a default export`));
                continue;
            }

            if(typeof instance.default !== 'function') {
                errors.push(new Error(`Module ${file} does not have a default export that is a function`));
                continue;
            }

            const isIconExternal = instance.icon && instance.icon.startsWith('http');

    
            const obj = {
                name: instance.name || path.basename(file).split('.')[0],
                description: instance.description,
                version: instance.version || '0.0.0',
                schema: instance.schema || [],
            } as ModuleInstance;
 
            if(withRunnable) {
                obj.execute = instance.default;
            }

            if(instance.icon) {

                if(isIconExternal) obj.icon = instance.icon;
                else {
                    const isIconValid = fs.existsSync(path.join(MODULES_PATH, 'icons', instance.icon));
                    if(isIconValid) {
                        obj.icon = `media:///${path.join(MODULES_PATH, 'icons', instance.icon)}`
                    }
                }
            }

            loadedModules.push(obj);
        } catch (error) {
            errors.push(error as Error);
        }
    }

    return [loadedModules, errors] as const;
}

export async function runModule(window: BrowserWindow, moduleName: string, data: any) {
    const [modules, errors] = await loadModules();
    const module = modules.find(m => m.name === moduleName);
    if (!module) {
        errors.push(new Error(`Module ${moduleName} not found`));
        return [false, errors] as const;
    }
    clearLog(moduleName);
    window.webContents.send(`log-update-${moduleName}`);

    console.log(`sent loading-${moduleName}`, true);
    window.webContents.send(`loading-${moduleName}`, true);
    try {
        await module.execute({
            data,
            api: {
                youtube: {
                    getInfo: (url: string): any => getInfoYoutube(url),
                    download: downloadYoutube
                },
                tiktok: {
                    getInfo: (url: string): any => getInfoTiktok(url), 
                    download: downloadTiktok
                },
                dialog: {
                    open: async (options: any) => {
                        return await openDialog(window, options);
                    },
                    save: async (options: any) => {
                        return await saveDialog(window, options);
                    }
                }
            },
            log: (...args: any[]) => {
                writeLog(moduleName, ...args);
                window.webContents.send(`log-update-${moduleName}`);
            }
        });
    } catch (error) {
        writeLog(moduleName, error);
        window.webContents.send(`log-update-${moduleName}`);
    }
   
    console.log(`sent loading-${moduleName}`, false);
    window.webContents.send(`loading-${moduleName}`, false);

    return [true, errors] as const;
}