"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFileFromVirtualFolder = checkFileFromVirtualFolder;
const node_fs_1 = require("node:fs");
const util_1 = require("./util");
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = require("node:fs/promises");
async function checkFileFromVirtualFolder(htmlFolderPath, currentPath) {
    let contentType = (0, util_1.getContentType)(currentPath);
    let filePath = node_path_1.default.join(htmlFolderPath, currentPath);
    if (!(0, node_fs_1.existsSync)(filePath)) {
        return null;
    }
    let fileContent = await (0, promises_1.readFile)(filePath);
    let uint8 = new Uint8Array(fileContent);
    return {
        content: uint8,
        contentType
    };
}
