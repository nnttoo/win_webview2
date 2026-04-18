import path from "node:path";
import { findUserProjectRoot, getWWVNodeModuleFolder } from "./dirnameTool";
import { readConfig, WwfBinFileName, WwvPlatFrom } from "./ww2_config";
import { existsSync } from "node:fs";
import { config } from "node:process";
import { getWWvVersion } from "../builder/versiontool";
import { downloadFile } from "./downloader";
import { mkdir, unlink } from "node:fs/promises";
import AdmZip from "adm-zip";



interface ResourceRequest {
    uri: string,
    method: string,
    body: Uint8Array
}

interface ResourceResponse {
    status: number,
    contentType: string,
    body: Uint8Array
}

export interface Ww2WebConfig {
    onClose: (err: any, data: any) => void;
    wclassname: string;
    url: string;
    title: string;

    width: number;
    height: number;
    isKiosk: boolean;
    isMaximize: boolean;
    isDebug: boolean;
    virtualHostName?: string,
    onVirtualHostRequested?: (req: ResourceRequest, reply: (res: ResourceResponse) => void) => void
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




export interface Ww2Module {
    openWeb: (arg: Ww2WebConfig) => void;
    openFileDialog: (arg: WW2FileDialogArg) => void;
    openFolderDialog: (arg: WW2FileDialogArg) => void;
    controlWindow: (arg: WW2ControlWindowsArg) => void;
}
 
function extractZip(zipPath: string, targetDir: string): void {
  try {
    const zip = new AdmZip(zipPath); 
    zip.extractAllTo(targetDir, true);
    
    console.log(`✅ Extract done to: ${targetDir}`);
  } catch (err) {
    console.error("❌ Error extract:", err);
  }
};

const binFileVersion = "1.1.19";

async function downloadModuleFile( platform: WwvPlatFrom) {

    let modulePath = getWWVNodeModuleFolder();
    let winlibPath = path.join(modulePath,"win_lib");
    let fileName = platform + ".zip"
    let filePath = path.join(winlibPath, fileName)


    let url = `https://github.com/nnttoo/win_webview2/releases/download/${binFileVersion}/${fileName}`;
    console.log("Bin File Version : " + binFileVersion);
    console.log("downloading :\n",url);
    try {
        
        let dir = path.dirname(filePath);
        await mkdir(dir,{recursive : true});
    } catch (error) {
        
    }

    await downloadFile(url,filePath);
}

async function sleep(n : number){
    return new Promise((r,x)=>{
        setTimeout(() => {
            r(null);
        }, n);
    })
}

export async function downloadModuleAndExtract(platform: WwvPlatFrom) {
    await downloadModuleFile(platform); 
    
    let modulePath = getWWVNodeModuleFolder();
    let winlibPath = path.join(modulePath,"win_lib");
    let fileName = platform + ".zip";
    
    let filePath = path.join(winlibPath, fileName)

    extractZip(filePath,path.join(winlibPath,platform));  
    await sleep(1000);
}

function getCurrentPlatform(){
    let result : WwvPlatFrom = "x64";
    if(process.arch != 'x64'){
        result = "x86";
    }

    return result;
}


export async function getModule() {
    let addOnName = "ww2_addon.node"; 
    let platform = getCurrentPlatform();

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
        let r = path.join(wwvModulePath, `win_lib/${platform}/ww2_addon.node`);

        return r;


    })(); 

    if (filepath == null) throw "file path is null";
    if (!existsSync(filepath)) {
        await downloadModuleAndExtract(platform);
    }

    let myAddon = require(filepath) as Ww2Module;
    return myAddon;
}