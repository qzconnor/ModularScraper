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
                download: (url: string, progressCallback: ProgressCallback) => Promise<string>;
            };
        }
    }) => Promise<void>;
}

export type ModuleInstanceWithoutExecute = Omit<ModuleInstance, 'execute'>;

export type ExecuteLog = (...args: any[]) => void;


export type ProgressCallback = (type: string, percent: number) => void;