import {MODULES_PATH} from "./module-loader"
import * as fs from 'fs';
import * as path from 'path';

export function ensureLogFolder() {
    const logPath = path.join(MODULES_PATH, "..", 'module-logs');
    if(!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath);
    }
}


export function writeLog(module: string, ...args: any[]) {
    const logPath = path.join(MODULES_PATH, "..", 'module-logs', module + '.log');

    if(!fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, '');
    }
    fs.appendFileSync(logPath, args.join(' ') + '\n');
}

export function readLog(module: string) {
    const logPath = path.join(MODULES_PATH, "..", 'module-logs', module + '.log');
    if(!fs.existsSync(logPath)) return '';

    const content = fs.readFileSync(logPath, 'utf-8').split('\n')

    return content;
}

export function clearLog(module: string) {
    const logPath = path.join(MODULES_PATH, "..", 'module-logs', module + '.log');
    if(fs.existsSync(logPath)) fs.unlinkSync(logPath);
}