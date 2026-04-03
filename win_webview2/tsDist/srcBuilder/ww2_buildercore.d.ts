import { ConfigWW2 } from './builder_tp';
export declare class WW2Deploy {
    configObjec?: ConfigWW2;
    outputExeFile?: string;
    makeDistFolder(): Promise<void>;
    buildIcon(): Promise<void>;
    copyExe(): Promise<void>;
    editIcon(): Promise<void>;
    readConfig(): Promise<void>;
    copyNodeExe(): Promise<void>;
    createIndexConf(): Promise<void>;
    static initWW2(): Promise<void>;
    static startDeploy(): Promise<void>;
}
