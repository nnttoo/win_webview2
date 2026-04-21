"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadModuleAndExtract = downloadModuleAndExtract;
exports.getModule = getModule;
const node_path_1 = __importDefault(require("node:path"));
const dirnameTool_1 = require("./dirnameTool");
const node_fs_1 = require("node:fs");
const downloader_1 = require("./downloader");
const promises_1 = require("node:fs/promises");
const adm_zip_1 = __importDefault(require("adm-zip"));
function extractZip(zipPath, targetDir) {
    try {
        const zip = new adm_zip_1.default(zipPath);
        zip.extractAllTo(targetDir, true);
        console.log(`✅ Extract done to: ${targetDir}`);
    }
    catch (err) {
        console.error("❌ Error extract:", err);
    }
}
;
const binFileVersion = "1.1.24";
async function downloadModuleFile(platform) {
    let modulePath = (0, dirnameTool_1.getWWVNodeModuleFolder)();
    let winlibPath = node_path_1.default.join(modulePath, "win_lib");
    let fileName = platform + ".zip";
    let filePath = node_path_1.default.join(winlibPath, fileName);
    let url = `https://github.com/nnttoo/win_webview2/releases/download/${binFileVersion}/${fileName}`;
    console.log("Bin File Version : " + binFileVersion);
    console.log("downloading :\n", url);
    try {
        let dir = node_path_1.default.dirname(filePath);
        await (0, promises_1.mkdir)(dir, { recursive: true });
    }
    catch (error) {
    }
    await (0, downloader_1.downloadFile)(url, filePath);
}
async function sleep(n) {
    return new Promise((r, x) => {
        setTimeout(() => {
            r(null);
        }, n);
    });
}
async function downloadModuleAndExtract(platform) {
    await downloadModuleFile(platform);
    let modulePath = (0, dirnameTool_1.getWWVNodeModuleFolder)();
    let winlibPath = node_path_1.default.join(modulePath, "win_lib");
    let fileName = platform + ".zip";
    let filePath = node_path_1.default.join(winlibPath, fileName);
    extractZip(filePath, node_path_1.default.join(winlibPath, platform));
    await sleep(1000);
}
function getCurrentPlatform() {
    let result = "x64";
    if (process.arch != 'x64') {
        result = "x86";
    }
    return result;
}
async function getModule() {
    let addOnName = "ww2_addon.node";
    let platform = getCurrentPlatform();
    let filepath = (() => {
        let userFolder = (0, dirnameTool_1.findUserProjectRoot)();
        if (userFolder == null)
            return null;
        let r = node_path_1.default.join(userFolder, addOnName);
        if (!(0, node_fs_1.existsSync)(r))
            return null;
        return r;
    })();
    filepath = await (async () => {
        if (filepath != null)
            return filepath;
        let wwvModulePath = (0, dirnameTool_1.getWWVNodeModuleFolder)();
        let r = node_path_1.default.join(wwvModulePath, `win_lib/${platform}/ww2_addon.node`);
        return r;
    })();
    if (filepath == null)
        throw "file path is null";
    if (!(0, node_fs_1.existsSync)(filepath)) {
        await downloadModuleAndExtract(platform);
    }
    let myAddon = require(filepath);
    return myAddon;
}
