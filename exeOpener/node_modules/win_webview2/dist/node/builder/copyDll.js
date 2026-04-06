"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const dirnameTool_1 = require("../tsExport/dirnameTool");
function debugDir(dirPath) {
    (0, node_child_process_1.exec)("cd " + dirPath + "&& dir", (s, o) => {
        console.log(o);
    });
}
(async () => {
    let result = "\n";
    let dirname = (0, dirnameTool_1.getWw2Dirname)();
    let rootPath = dirname.ww2ModulePath;
    console.log(rootPath);
    let copyFromRoot = async (src, target) => {
        try {
            result += "\n" + target;
            await (0, promises_1.copyFile)(node_path_1.default.join(rootPath, src), node_path_1.default.join(rootPath, target));
        }
        catch (error) {
            console.log(error);
        }
    };
    try {
        await (0, promises_1.mkdir)(node_path_1.default.join(rootPath, "win_webview2/win_lib/Win32"));
    }
    catch {
    }
    try {
        await (0, promises_1.mkdir)(node_path_1.default.join(rootPath, "win_webview2/win_lib/x64"));
    }
    catch (error) {
    }
    await copyFromRoot("exeOpener/build/x64/exeOpenner.exe", "win_webview2/win_lib/x64/exeOpenner.exe");
    await copyFromRoot("exeOpener/build/x64/splash.png", "win_webview2/win_lib/x64/splash.png");
    await copyFromRoot("exeOpener/build/x86/exeOpenner.exe", "win_webview2/win_lib/Win32/exeOpenner.exe");
    await copyFromRoot("exeOpener/build/x86/splash.png", "win_webview2/win_lib/Win32/splash.png");
    console.log("copy webview2 32");
    await copyFromRoot("nodeAddOn/build/ia32/Release/ww2_addon.node", "win_webview2/win_lib/Win32/ww2_addon.node");
    await copyFromRoot("nodeAddOn/build/ia32/Release/WebView2Loader.dll", "win_webview2/win_lib/Win32/WebView2Loader.dll");
    console.log("copy webview2 64");
    await copyFromRoot("nodeAddOn/build/x64/Release/ww2_addon.node", "win_webview2/win_lib/x64/ww2_addon.node");
    await copyFromRoot("nodeAddOn/build/x64/Release/WebView2Loader.dll", "win_webview2/win_lib/x64/WebView2Loader.dll");
    console.log("copy done :" + result);
})();
