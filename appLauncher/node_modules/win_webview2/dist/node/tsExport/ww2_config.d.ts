export type WwvPlatFrom = 'x86' | 'x64';
export type WwfBinFileName = "exeOpenner.exe" | "WebView2Loader.dll" | "ww2_addon.node" | "splash.png";
export type ConfigWW2 = {
    appname: string;
    entry_point: string;
    outdir: string;
    platform: WwvPlatFrom;
};
export declare function readConfig(): Promise<ConfigWW2>;
