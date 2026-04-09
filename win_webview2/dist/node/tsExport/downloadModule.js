"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModule = getModule;
const node_path_1 = __importDefault(require("node:path"));
const dirnameTool_1 = require("./dirnameTool");
const ww2_config_1 = require("./ww2_config");
const node_fs_1 = require("node:fs");
const downloader_1 = require("./downloader");
const promises_1 = require("node:fs/promises");
function getLibFilePath(libName, platform) {
    let modulePath = (0, dirnameTool_1.getWWVNodeModuleFolder)();
    modulePath = node_path_1.default.join(modulePath, "win_lib", platform, libName);
    return modulePath;
}
const binFileVersion = "1.1.14";
async function downloadModuleFile(libname, platform) {
    let filePath = getLibFilePath(libname, platform);
    let url = `https://github.com/nnttoo/win_webview2/releases/download/${binFileVersion}_${platform}/${libname}`;
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
async function downloadModule(platform) {
    await downloadModuleFile("ww2_addon.node", platform);
    await downloadModuleFile("WebView2Loader.dll", platform);
    await downloadModuleFile("exeOpenner.exe", platform);
    await downloadModuleFile("splash.png", platform);
}
async function getModule() {
    let addOnName = "ww2_addon.node";
    let config = await (0, ww2_config_1.readConfig)();
    if (config == null)
        throw "cannot read config";
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
        let r = node_path_1.default.join(wwvModulePath, `win_lib/${config.platform}/ww2_addon.node`);
        return r;
    })();
    if (filepath == null)
        throw "file path is null";
    if (!(0, node_fs_1.existsSync)(filepath)) {
        await downloadModule(config.platform);
    }
    let myAddon = require(filepath);
    return myAddon;
}
