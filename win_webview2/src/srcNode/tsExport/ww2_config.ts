import { readFile } from "node:fs/promises";
import { findUserProjectRoot } from "./dirnameTool";
import path from "node:path";
import { existsSync } from "node:fs";

export type ConfigWW2 = {
    appname: string;
    entry_point: string;
    outdir: string;
    platform: 'Win32' | 'x64'
};


const jsonConfigFilePath = "./win_webview2.json";
export async function readConfig() {
    let userDir = findUserProjectRoot();
    if (userDir == null) throw "readConfig() => findProjectUser failed"

    let jsonPath = path.join(userDir, jsonConfigFilePath); 
    let str = await readFile(jsonPath);
    let jsonObj = JSON.parse(str.toString());
    return jsonObj as ConfigWW2;
}