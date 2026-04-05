"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ww2Init = ww2Init;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const dirnameTool_1 = require("../tsExport/dirnameTool");
const path_1 = __importDefault(require("path"));
const jsonConfigFilePath = "./win_webview2.json";
let mdirname = (0, dirnameTool_1.getWw2Dirname)();
let ww2ModulePath = path_1.default.join(mdirname._dirname, "../../../");
async function ww2Init() {
    let ww2Config = {
        entry_point: "app.js",
        appname: "openweb",
        outdir: "./dist",
        platform: 'x64',
    };
    let objstr = JSON.stringify(ww2Config, null, 2);
    if (!(0, fs_1.existsSync)(jsonConfigFilePath)) {
        await (0, promises_1.writeFile)(jsonConfigFilePath, objstr);
    }
    else {
        let str = await (0, promises_1.readFile)(jsonConfigFilePath, "utf-8");
        ww2Config = JSON.parse(str);
    }
    console.log(ww2Config);
    if (!(0, fs_1.existsSync)("./assets")) {
        await (0, promises_1.mkdir)("./assets");
    }
    await (0, promises_1.copyFile)(path_1.default.join(ww2ModulePath, "win_lib/x64/splash.png"), path_1.default.join("./assets/icon.png"));
    try {
        await (0, promises_1.mkdir)(path_1.default.join("./assets", "html"));
    }
    catch (error) {
    }
}
