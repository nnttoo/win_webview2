import { readFile } from "node:fs/promises";
import { findUserProjectRoot } from "./dirnameTool";
import path from "node:path";

export type ConfigWW2 = {
    appname: string; 
    entry_point: string;
    outdir: string;
    platform: 'Win32' | 'x64'
};


const jsonConfigFilePath = "./win_webview2.json";
export async function readConfig() {
    let userDir = findUserProjectRoot();
    if (userDir == null) return null;



    let str = await readFile(path.join(userDir, jsonConfigFilePath));
    let jsonObj = JSON.parse(str.toString());

    return jsonObj as ConfigWW2;
}