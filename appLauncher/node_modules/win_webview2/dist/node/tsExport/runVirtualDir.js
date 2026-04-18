"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runVirtualDir = runVirtualDir;
const node_path_1 = __importDefault(require("node:path"));
const downloadModule_1 = require("./downloadModule");
const winwebview2_1 = require("./winwebview2");
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
function byteArrayFromString(txt) {
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(txt);
    return uint8Array;
}
function byteArrayToString(body) {
    const decoder = new TextDecoder('utf-8');
    const str = decoder.decode(body);
    return str;
}
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.zip': 'application/zip'
};
function getContentType(url) {
    const ext = url.substring(url.lastIndexOf('.')).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}
async function getFile(htmlFolderPath, currentPath) {
    let contentType = getContentType(currentPath);
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
async function checkWw2BrowserFunction(arg) {
    if (arg.path != "/ww2_post")
        return null;
    if (arg.method != "POST")
        return null;
    if (arg.body == null)
        return null;
    let result = null;
    try {
        let bodyString = byteArrayToString(arg.body);
        let jsonObj = JSON.parse(bodyString);
    }
    catch (error) {
    }
    return result;
}
function runVirtualDir(config) {
    (0, downloadModule_1.getModule)().then((wwv) => {
        (0, winwebview2_1.closeSplash)();
        let hostname = "https://myapp.local";
        let wwvConfig = {
            onClose: config.onClose,
            height: config.height,
            width: config.width,
            wclassname: config.wclassname,
            isDebug: config.isDebug,
            isKiosk: config.isKiosk,
            isMaximize: config.isMaximize,
            virtualHostName: hostname,
            url: hostname,
            onVirtualHostRequested: async (req, response) => {
                try {
                    let parsedUrl = new URL(req.uri, hostname);
                    let cleanPath = parsedUrl.pathname;
                    if (cleanPath == "/")
                        cleanPath = "index.html";
                    console.log(cleanPath);
                    let file = await getFile(config.htmlFolderPath, cleanPath);
                    if (file != null) {
                        response({
                            body: file.content,
                            contentType: file.contentType,
                            status: 200
                        });
                        return;
                    }
                    response({
                        body: byteArrayFromString("test dulu"),
                        contentType: "text/plain",
                        status: 200
                    });
                }
                catch (error) {
                }
            },
            title: config.title,
        };
        wwv.openWeb(wwvConfig);
    });
}
