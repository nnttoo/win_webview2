"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openWeb = openWeb;
exports.openDialogFile = openDialogFile;
exports.openDialogFolder = openDialogFolder;
exports.closeWindowWebView = closeWindowWebView;
const node_child_process_1 = require("node:child_process");
const promises_1 = require("node:fs/promises");
const jsonConfigFilePath = "./win_webview2.json";
async function readConfig() {
    let str = await (0, promises_1.readFile)(jsonConfigFilePath);
    let jsonObj = JSON.parse(str.toString());
    return jsonObj;
}
async function getExecPath() {
    let jsonConfig = await readConfig();
    let exeFilePath = jsonConfig.appname + ".exe";
    return exeFilePath;
}
async function openWeb(arg) {
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
    (0, node_child_process_1.execFile)(exeFilePath, arrOpen, (err, data) => {
        console.log(err);
    });
}
async function openDialogFile(arg) {
    let exeFilePath = await getExecPath();
    return new Promise((r, x) => {
        (0, node_child_process_1.execFile)(exeFilePath, [
            "fun=openFileDialog",
            "wndClassName=" + arg.winClassName,
            "filter=" + arg.filter,
        ], (/** @type {any} */ err, /** @type {string} */ data) => {
            let filepath = "";
            for (let l of data.split("\r\n")) {
                if (l.startsWith("result:")) {
                    filepath = l.substring(7, l.length);
                }
            }
            r(filepath);
        });
    });
}
async function openDialogFolder(arg) {
    let exeFilePath = await getExecPath();
    return new Promise((r, x) => {
        (0, node_child_process_1.execFile)(exeFilePath, [
            "fun=openFolderDialog",
            "wndClassName=" + arg.winClassName,
        ], (
        /** @type {any} */
        err, 
        /** @type {string} */
        data) => {
            let filepath = "";
            for (let l of data.split("\r\n")) {
                if (l.startsWith("result:")) {
                    filepath = l.substring(7, l.length);
                }
            }
            r(filepath);
        });
    });
}
async function closeWindowWebView(arg) {
    let exeFilePath = await getExecPath();
    return new Promise((r, x) => {
        (0, node_child_process_1.execFile)(exeFilePath, [
            "fun=closewindow",
            "wndClassName=" + arg.winClassName,
        ], (
        /** @type {any} */
        err, 
        /** @type {string} */
        data) => {
            r(data);
        });
    });
}
