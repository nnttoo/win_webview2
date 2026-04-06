"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWWvVersion = getWWvVersion;
const node_path_1 = __importDefault(require("node:path"));
const dirnameTool_1 = require("../tsExport/dirnameTool");
const promises_1 = require("node:fs/promises");
/** Ini hanya bisa dipakai dengan cara tidak bundle
karena package json mungkin gak ada
 */
async function getWWvVersion() {
    let result = "";
    try {
        let wwvModulePath = (0, dirnameTool_1.getWWVNodeModuleFolder)();
        let jsonPath = node_path_1.default.join(wwvModulePath, "package.json");
        let jsontxt = await (0, promises_1.readFile)(jsonPath, "utf-8");
        let jsonObj = JSON.parse(jsontxt);
        result = jsonObj.version;
    }
    catch (error) {
    }
    return result;
}
