import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {   findUserProjectRoot, getWWVNodeModuleFolder } from "./dirnameTool";
import { ConfigWW2, readConfig } from "./ww2_config";

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



export async function getModule() {
    let addOnName = "ww2_addon.node";

    let filepath = (()=>{

        let userFolder = findUserProjectRoot();
        if(userFolder == null) return null;
        let r = path.join(
            userFolder,
            addOnName
        );

        if(!existsSync(r)) return null;

        return r;

    })();

    filepath = await ( async ()=>{
        if(filepath != null) return filepath;
        let wwvModulePath = getWWVNodeModuleFolder();
        let config = await readConfig();
        if(config == null) return null;

        let r =  path.join(wwvModulePath, `win_lib/${config.platform}/ww2_addon.node`);

        return r;
        

    })(); 

    if(filepath == null) throw "file not found";

    let myAddon = require(filepath) as Ww2Module;
    return myAddon;
}

export function closeSplash(){
    return getModule().then((module)=>{
        module.controlWindow({
            controlcmd : "close",
            wndClassName : "mysplashclassname"
        })
    });
}



export * from "./ww2_server"
export {findUserProjectRoot } from "./dirnameTool"
export {readConfig} ; 
export {getWWVNodeModuleFolder}
