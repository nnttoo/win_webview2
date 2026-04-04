import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";

export interface Ww2WebConfig {
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

export interface WW2FileDialogArg {
    callback: (err: any, data: any) => void;
    filter :  string;
    ownerClassName : string;
}

export interface WW2ControlWindowsArg{
    wndClassName : string;
    controlcmd : "close" | "move" | "maximize" | "minimize" | "resize" | "check",
    left? : number;
    top? : number;
    height? : number;
    width? : number;
}

export interface Ww2Module {
    openWeb: (arg: Ww2WebConfig) => void;
    openFileDialog: (arg: WW2FileDialogArg) => void;
    openFolderDialog :(arg: WW2FileDialogArg) => void;
    controlWindow :(arg: WW2ControlWindowsArg) => void;
}


const jsonConfigFilePath = "./win_webview2.json"; 
async function readConfig() {
    let str = await readFile(jsonConfigFilePath);
    let jsonObj = JSON.parse(str.toString());

    return jsonObj;
}

async function getModules(){
    let filepath = path.join(
    __dirname,
    "./ww2_addon.node"
    );

const myAddon = require(filepath) as Ww2Module;
return myAddon;
}


async function getExecPath() {
    let jsonConfig = await readConfig();
    let exeFilePath = jsonConfig.appname + ".exe";

    return exeFilePath;

}

export async function openWeb(arg : Ww2WebConfig) {
    let module = await getModules();

    module.openWeb(arg);
     
}
 
// export async function openDialogFile(arg : OpenDialogFileArg) {
//     let exeFilePath = await getExecPath();
//     return new Promise((r, x) => {
//         execFile(exeFilePath,
//             [
//                 "fun=openFileDialog",
//                 "wndClassName="+arg.winClassName,
//                 "filter=" + arg.filter,

//             ], (/** @type {any} */ err, /** @type {string} */ data) => {

//                 let filepath = "";
//                 for (let l of data.split("\r\n")) {
//                     if (l.startsWith("result:")) {
//                         filepath = l.substring(7, l.length);
//                     }
//                 }

//                 r(filepath);
//             })
//     })
// }
 
// export async function openDialogFolder(arg : OpenDialogArg) {
//     let exeFilePath = await getExecPath();
//     return new Promise((r, x) => {
//         execFile(exeFilePath,
//             [
//                 "fun=openFolderDialog",
//                 "wndClassName=" + arg.winClassName,

//             ], (
//                 /** @type {any} */
//                 err,
//                 /** @type {string} */
//                 data
//             ) => {

//             let filepath = "";
//             for (let l of data.split("\r\n")) {
//                 if (l.startsWith("result:")) {
//                     filepath = l.substring(7, l.length);
//                 }
//             }

//             r(filepath);
//         })
//     })
// } 
 
// export async function controlWindow(arg : {
//     winClassName: string,
//     controlcmd : "close" | "maximize" | "minimize" | "move" | "resize",
//     left : number,
//     top :  number,
//     width : number,
//     height : number,
// }) {
//     let exeFilePath = await getExecPath();
//     return new Promise((r, x) => {
//         execFile(exeFilePath,
//             [
//                 "fun=controlwindow",
//                 "wndClassName=" + arg.winClassName,
//                 "controlcmd="+arg.controlcmd,

//                 "left="+arg.left,
//                 "top="+arg.top,
//                 "width="+arg.width,
//                 "height="+arg.height,


//             ], ( 
//                 /** @type {any} */
//                 err,
//                 /** @type {string} */
//                 data) => {

                 
//                 r(data);
//             })
//     })
// }
