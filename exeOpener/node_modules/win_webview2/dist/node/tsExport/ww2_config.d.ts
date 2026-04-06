export type ConfigWW2 = {
    appname: string;
    entry_point: string;
    outdir: string;
    platform: 'Win32' | 'x64';
};
export declare function readConfig(): Promise<ConfigWW2>;
