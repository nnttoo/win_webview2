import { readFile } from "node:fs/promises";

export type ConfigWW2 = {
    appname: string;
    icon_path: string;
    entry_point: string;
    outdir: string;
    platform : 'Win32' | 'x64'
};


const jsonConfigFilePath = "./win_webview2.json"; 
export async function readConfig() {
    let str = await readFile(jsonConfigFilePath);
    let jsonObj = JSON.parse(str.toString());

    return jsonObj as ConfigWW2;
}