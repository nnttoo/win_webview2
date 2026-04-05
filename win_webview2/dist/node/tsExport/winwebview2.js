"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWw2Dirname = exports.readConfig = exports.findUserProjectRoot = void 0;
exports.getModule = getModule;
exports.closeSplash = closeSplash;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const dirnameTool_1 = require("./dirnameTool");
Object.defineProperty(exports, "getWw2Dirname", { enumerable: true, get: function () { return dirnameTool_1.getWw2Dirname; } });
const ww2_config_1 = require("./ww2_config");
Object.defineProperty(exports, "readConfig", { enumerable: true, get: function () { return ww2_config_1.readConfig; } });
async function getModule() {
    let dirname = (0, dirnameTool_1.getWw2Dirname)();
    let filepath = node_path_1.default.join(dirname._dirname, "./ww2_addon.node");
    if (!(0, node_fs_1.existsSync)(filepath)) {
        let config = await (0, ww2_config_1.readConfig)();
        if (config == null)
            throw "user config null";
        filepath = node_path_1.default.join(dirname._dirname, `../../../win_lib/${config.platform}/ww2_addon.node`);
    }
    let myAddon = require(filepath);
    return myAddon;
}
function closeSplash() {
    return getModule().then((module) => {
        module.controlWindow({
            controlcmd: "close",
            wndClassName: "mysplashclassname"
        });
    });
}
__exportStar(require("./ww2_server"), exports);
var dirnameTool_2 = require("./dirnameTool");
Object.defineProperty(exports, "findUserProjectRoot", { enumerable: true, get: function () { return dirnameTool_2.findUserProjectRoot; } });
