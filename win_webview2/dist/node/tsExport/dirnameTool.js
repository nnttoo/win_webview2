"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserProjectRoot = findUserProjectRoot;
exports.getWWVNodeModuleFolder = getWWVNodeModuleFolder;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = require("node:fs");
function findUserProjectRootRecrusive(currentDir = process.cwd()) {
    const packagePath = node_path_1.default.join(currentDir, 'package.json');
    if ((0, node_fs_1.existsSync)(packagePath)) {
        return currentDir;
    }
    const parentDir = node_path_1.default.dirname(currentDir);
    if (parentDir === currentDir) {
        return null;
    }
    return findUserProjectRootRecrusive(parentDir);
}
function findUserProjectRoot() {
    // - Deployed Condition 
    const packagePath = node_path_1.default.join(node_path_1.default.dirname(process.execPath), 'package.json');
    if ((0, node_fs_1.existsSync)(packagePath)) {
        return node_path_1.default.dirname(packagePath);
    }
    return findUserProjectRootRecrusive(process.cwd());
}
function getWWVNodeModuleFolder() {
    let userRootProject = findUserProjectRoot();
    if (userRootProject == null)
        throw "root project user not found";
    let nodeModuleFolder = node_path_1.default.join(userRootProject, "node_modules/win_webview2");
    if (!(0, node_fs_1.existsSync)(nodeModuleFolder)) {
        if (userRootProject.endsWith("win_webview2")) {
            console.log("on source win_webview2folder \n\n");
            let npath = node_path_1.default.join(nodeModuleFolder, "../../");
            nodeModuleFolder = npath;
        }
    }
    return nodeModuleFolder;
}
