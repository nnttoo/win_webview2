"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openWeb = openWeb;
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const jsonConfigFilePath = "./win_webview2.json";
async function readConfig() {
    let str = await (0, promises_1.readFile)(jsonConfigFilePath);
    let jsonObj = JSON.parse(str.toString());
    return jsonObj;
}
async function getModules() {
    let filepath = node_path_1.default.join(__dirname, "./ww2_addon.node");
    const myAddon = require(filepath);
    return myAddon;
}
async function getExecPath() {
    let jsonConfig = await readConfig();
    let exeFilePath = jsonConfig.appname + ".exe";
    return exeFilePath;
}
async function openWeb(arg) {
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
