"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyDir = copyDir;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
async function copyDir(source, destination) {
    // pastikan folder tujuan ada
    await fs_1.promises.mkdir(destination, { recursive: true });
    const entries = await fs_1.promises.readdir(source, { withFileTypes: true });
    for (const entry of entries) {
        let srcPath = path_1.default.join(source, entry.name);
        let destPath = path_1.default.join(destination, entry.name);
        if (entry.isDirectory()) {
            // rekursif ke subfolder
            await copyDir(srcPath, destPath);
        }
        else {
            await fs_1.promises.copyFile(srcPath, destPath);
        }
    }
}
