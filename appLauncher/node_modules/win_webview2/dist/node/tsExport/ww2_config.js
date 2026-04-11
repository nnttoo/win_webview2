"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readConfig = readConfig;
const promises_1 = require("node:fs/promises");
const dirnameTool_1 = require("./dirnameTool");
const node_path_1 = __importDefault(require("node:path"));
const jsonConfigFilePath = "./win_webview2.json";
async function readConfig() {
    let userDir = (0, dirnameTool_1.findUserProjectRoot)();
    if (userDir == null)
        throw "readConfig() => findProjectUser failed";
    let jsonPath = node_path_1.default.join(userDir, jsonConfigFilePath);
    let str = await (0, promises_1.readFile)(jsonPath);
    let jsonObj = JSON.parse(str.toString());
    return jsonObj;
}
