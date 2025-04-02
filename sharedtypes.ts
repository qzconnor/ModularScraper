export type ModuleInstance = {
    name: string;
    description?: string;
    version: string;
    schema: Record<string, any>;
    icon?: string;
    execute: (options: {
        data: any;
        log: ExecuteLog;
        api: {
            youtube: {
                getInfo: (url: string) => Promise<any>;
                download: (url: string, filePath:string, progressCallback: ProgressCallback) => Promise<string>;
            },
            tiktok: {
                getInfo: (url: string) => Promise<any>;
                download: (url: string, outPath: string, callback: (progess: number) => void) => Promise<void>;
            },
            dialog: {
                open: (options: any) => Promise<any>;
                save: (options: any) => Promise<any>;
                showFileInFolder: (path: string) => void;
            }
        }
    }) => Promise<void>;
}

export type ModuleInstanceWithoutExecute = Omit<ModuleInstance, 'execute'>;

export type ExecuteLog = (...args: any[]) => void;


export type ProgressCallback = (type: string, percent: number) => void;