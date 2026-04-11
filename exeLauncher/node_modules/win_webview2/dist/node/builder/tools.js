"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirname = getDirname;
const node_url_1 = require("node:url");
const node_path_1 = require("node:path");
function getDirname() {
    // Trik deteksi lingkungan
    const _filename = typeof __filename !== 'undefined'
        ? __filename
        : (0, node_url_1.fileURLToPath)(import.meta.url);
    const _dirname = typeof __dirname !== 'undefined'
        ? __dirname
        : (0, node_path_1.dirname)(_filename);
    return { _dirname, _filename };
}
