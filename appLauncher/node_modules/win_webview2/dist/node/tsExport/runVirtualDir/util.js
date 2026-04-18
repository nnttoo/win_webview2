"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.byteArrayFromString = byteArrayFromString;
exports.byteArrayToString = byteArrayToString;
exports.getContentType = getContentType;
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
