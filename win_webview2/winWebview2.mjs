//@ts-check

import { exec, execFile } from "child_process";
import { readFile } from "fs/promises";

import { arch } from "os";
const arc = arch();

function sleep(n = 1000) {
    return new Promise((r, x) => {
        setTimeout(r, n);
    })
}

const jsonConfigFilePath = "./win_webview2.json";

/**
 * 
 * @returns {Promise<import("./ww2_builder_type").ConfigWW2> }
 */
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

/**
* 
* @param {import("./argtype").OpenWebArg } arg 
*/
export async function openWeb(arg) {
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
        console.log("error yaaa" + err)
    })
}



/**
 *
 * @param {import("./argtype").OpenDialogFileArg} arg
 * @returns {Promise<string>}
 */
export async function openDialogFile(arg) {
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

/**
 * 
 * @param {import("./argtype").OpenDialogArg} arg 
 * @returns 
 */
export async function openDialogFolder(arg) {
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
/**
 * 
 * @param {import("./argtype").OpenDialogArg} arg 
 * @returns 
 */
export async function closeWindowWebView(arg) {
    let exeFilePath = await getExecPath();
    return new Promise((r, x) => {
        execFile(exeFilePath,
            [
                "fun=closewindow",
                "wndClassName=" + arg.winClassName,

            ], ( 
                /** @type {any} */
                err,
                /** @type {string} */
                data) => {

                 
                r(data);
            })
    })
}

