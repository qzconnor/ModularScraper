import path from 'node:path';
import store from './singelton/store';
import * as fs from 'node:fs';
import type { ModuleInstance } from '../sharedtypes';
import { pathToFileURL } from 'url';

export const MODULES_PATH = path.join(path.dirname(store.path), 'modules');

export function ensureModulePath() {
    if (!fs.existsSync(MODULES_PATH)) {
        fs.mkdirSync(MODULES_PATH);
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
            const obj = {
                name: instance.name || path.basename(file).split('.')[0],
                description: instance.description,
                version: instance.version || '0.0.0',
                schema: instance.schema || [],
            } as ModuleInstance;
 
            if(withRunnable) {
                obj.execute = instance.default;
            }

            loadedModules.push(obj);
        } catch (error) {
            errors.push(error as Error);
        }
    }
    return [loadedModules, errors] as const;
}

export async function runModule(moduleName: string, data: any) {
    const [modules, errors] = await loadModules();
    const module = modules.find(m => m.name === moduleName);
    if (!module) {
        errors.push(new Error(`Module ${moduleName} not found`));
        return [false, errors] as const;
    }
    module.execute(data);
    return [true, errors] as const;
}