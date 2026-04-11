import path from "node:path";
import { findUserProjectRoot, getWWVNodeModuleFolder } from "./dirnameTool";
import { readConfig, WwfBinFileName, WwvPlatFrom } from "./ww2_config";
import { existsSync } from "node:fs";
import { config } from "node:process";
import { getWWvVersion } from "../builder/versiontool";
import { downloadFile } from "./downloader";
import { mkdir } from "node:fs/promises";




interface Ww2WebConfig {
    callback: (err: any, data: any) => void;
    wclassname: string;
    url: string;
    title: string;

    width: number;
    height: number;
    isKiosk: boolean;
    isMaximize: boolean;
    isDebug: boolean;

}

interface WW2FileDialogArg {
    callback: (err: any, data: any) => void;
    filter: string;
    ownerClassName: string;
}



export interface WW2ControlWindowsArg {
    wndClassName: string;
    controlcmd: "close" | "move" | "maximize" | "minimize" | "resize" | "check",
    left?: number;
    top?: number;
    height?: number;
    width?: number;
}




interface Ww2Module {
    openWeb: (arg: Ww2WebConfig) => void;
    openFileDialog: (arg: WW2FileDialogArg) => void;
    openFolderDialog: (arg: WW2FileDialogArg) => void;
    controlWindow: (arg: WW2ControlWindowsArg) => void;
}

function getLibFilePath(libName: WwfBinFileName, platform: WwvPlatFrom) {
    let modulePath = getWWVNodeModuleFolder();
    modulePath = path.join(modulePath, "win_lib", platform, libName);
 
    return modulePath;

}

const binFileVersion = "1.1.14";

async function downloadModuleFile(libname: WwfBinFileName, platform: WwvPlatFrom) {
    let filePath = getLibFilePath(libname, platform); 
    let url = `https://github.com/nnttoo/win_webview2/releases/download/${binFileVersion}_${platform}/${libname}`;
    console.log("Bin File Version : " + binFileVersion);
    console.log("downloading :\n",url);
    try {
        
        let dir = path.dirname(filePath);
        await mkdir(dir,{recursive : true});
    } catch (error) {
        
    }

    await downloadFile(url,filePath);
}

async function downloadModule(platform: WwvPlatFrom) {
    await downloadModuleFile("ww2_addon.node", platform);
    await downloadModuleFile("WebView2Loader.dll", platform);
    await downloadModuleFile("exeOpenner.exe", platform);
    await downloadModuleFile("splash.png", platform);
}



export async function getModule() {
    let addOnName = "ww2_addon.node";

    let config = await readConfig();
    if (config == null) throw "cannot read config";


    let filepath = (() => {

        let userFolder = findUserProjectRoot();
        if (userFolder == null) return null;
        let r = path.join(
            userFolder,
            addOnName
        );

        if (!existsSync(r)) return null;

        return r;

    })();

    filepath = await (async () => {
        if (filepath != null) return filepath;
        let wwvModulePath = getWWVNodeModuleFolder();
        let r = path.join(wwvModulePath, `win_lib/${config.platform}/ww2_addon.node`);

        return r;


    })(); 

    if (filepath == null) throw "file path is null";
    if (!existsSync(filepath)) {
        await downloadModule(config.platform);
    }

    let myAddon = require(filepath) as Ww2Module;
    return myAddon;
}