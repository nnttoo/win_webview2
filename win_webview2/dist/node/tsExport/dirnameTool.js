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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWw2Dirname = getWw2Dirname;
exports.findUserProjectRoot = findUserProjectRoot;
const node_url_1 = require("node:url");
const node_path_1 = __importStar(require("node:path"));
const node_fs_1 = require("node:fs");
function getWw2Dirname() {
    // Trik deteksi lingkungan
    const _filename = typeof __filename !== 'undefined'
        ? __filename
        // @ts-ignore:
        : (0, node_url_1.fileURLToPath)(eval('import.meta.url'));
    const _dirname = typeof __dirname !== 'undefined'
        ? __dirname
        : (0, node_path_1.dirname)(_filename);
    let ww2ModulePath = node_path_1.default.join(_dirname, "../../../");
    return { _dirname, _filename, ww2ModulePath };
}
function findUserProjectRoot(currentDir = process.cwd()) {
    const packagePath = node_path_1.default.join(currentDir, 'package.json');
    if ((0, node_fs_1.existsSync)(packagePath)) {
        return currentDir;
    }
    const parentDir = node_path_1.default.dirname(currentDir);
    if (parentDir === currentDir) {
        return null;
    }
    return findUserProjectRoot(parentDir);
}
