"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readConfig = readConfig;
const promises_1 = require("node:fs/promises");
const jsonConfigFilePath = "./win_webview2.json";
async function readConfig() {
    let str = await (0, promises_1.readFile)(jsonConfigFilePath);
    let jsonObj = JSON.parse(str.toString());
    return jsonObj;
}
