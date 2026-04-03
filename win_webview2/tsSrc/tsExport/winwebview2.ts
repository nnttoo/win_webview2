import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";

export type OpenWebArg = {
    url: string
    width: number 
    height: number
    kiosk: boolean 
    maximize: boolean
    title: string 
    isDebugMode : boolean
    winClassName : string
}

export type OpenDialogFileArg = { 
    winClassName : string
    filter : string
}


export type OpenDialogArg = { 
    winClassName : string 
}

const jsonConfigFilePath = "./win_webview2.json"; 
async function readConfig() {
    let str = await readFile(jsonConfigFilePath);
    let jsonObj = JSON.parse(str.toString());

    return jsonObj;
}

async function getExecPath() {
    let jsonConfig = await readConfig();
    let exeFilePath = jsonConfig.appname + ".exe";

    return exeFilePath;

}

export async function openWeb(arg : OpenWebArg) {
    let jsonConfig = await readConfig();
    let exeFilePath = jsonConfig.appname + ".exe";

    let arrOpen = [
        "fun=openwebview",
        "wndClassName=" + arg.winClassName,
        "url=" + arg.url,
        "width=" + arg.width,
        "height=" + arg.height,
        //"kiosk=true",
        //"maximize=true",
        "title=auto",
        //"isDebugMode=true"
    ];

    if (arg.maximize) {
        arrOpen.push("maximize=true");
    }

    if (arg.kiosk) {

        arrOpen.push("kiosk=true");
    }

    if (arg.isDebugMode) {
        arrOpen.push("isDebugMode=true");
    }




    execFile(exeFilePath, arrOpen, (err, data) => {
        console.log(  err)
    })
}
 
export async function openDialogFile(arg : OpenDialogFileArg) {
    let exeFilePath = await getExecPath();
    return new Promise((r, x) => {
        execFile(exeFilePath,
            [
                "fun=openFileDialog",
                "wndClassName="+arg.winClassName,
                "filter=" + arg.filter,

            ], (/** @type {any} */ err, /** @type {string} */ data) => {

                let filepath = "";
                for (let l of data.split("\r\n")) {
                    if (l.startsWith("result:")) {
                        filepath = l.substring(7, l.length);
                    }
                }

                r(filepath);
            })
    })
}
 
export async function openDialogFolder(arg : OpenDialogArg) {
    let exeFilePath = await getExecPath();
    return new Promise((r, x) => {
        execFile(exeFilePath,
            [
                "fun=openFolderDialog",
                "wndClassName=" + arg.winClassName,

            ], (
                /** @type {any} */
                err,
                /** @type {string} */
                data
            ) => {

            let filepath = "";
            for (let l of data.split("\r\n")) {
                if (l.startsWith("result:")) {
                    filepath = l.substring(7, l.length);
                }
            }

            r(filepath);
        })
    })
} 
 
export async function controlWindow(arg : {
    winClassName: string,
    controlcmd : "close" | "maximize" | "minimize" | "move" | "resize",
    left : number,
    top :  number,
    width : number,
    height : number,
}) {
    let exeFilePath = await getExecPath();
    return new Promise((r, x) => {
        execFile(exeFilePath,
            [
                "fun=controlwindow",
                "wndClassName=" + arg.winClassName,
                "controlcmd="+arg.controlcmd,

                "left="+arg.left,
                "top="+arg.top,
                "width="+arg.width,
                "height="+arg.height,


            ], ( 
                /** @type {any} */
                err,
                /** @type {string} */
                data) => {

                 
                r(data);
            })
    })
}
