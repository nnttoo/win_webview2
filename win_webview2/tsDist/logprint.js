"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logPrint = logPrint;
function logPrint(msg) {
    console.log(new Date().toLocaleString() + ": ", msg);
}
