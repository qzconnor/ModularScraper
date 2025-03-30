export type ModuleInstance = {
    name: string;
    description?: string;
    version: string;
    schema: Record<string, any>;
    execute: (options: {
        data: any;
    }) => void;
}

export type ModuleInstanceWithoutExecute = Omit<ModuleInstance, 'execute'>;

export type ExecuteLog = (...args: any[]) => void;