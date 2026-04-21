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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.builderApi = exports.runVirtualDir = exports.downloadModuleAndExtract = exports.getWWVNodeModuleFolder = exports.readConfig = exports.findUserProjectRoot = void 0;
exports.closeSplash = closeSplash;
const dirnameTool_1 = require("./dirnameTool");
Object.defineProperty(exports, "getWWVNodeModuleFolder", { enumerable: true, get: function () { return dirnameTool_1.getWWVNodeModuleFolder; } });
const ww2_config_1 = require("./ww2_config");
Object.defineProperty(exports, "readConfig", { enumerable: true, get: function () { return ww2_config_1.readConfig; } });
const downloadModule_1 = require("./downloadModule");
Object.defineProperty(exports, "downloadModuleAndExtract", { enumerable: true, get: function () { return downloadModule_1.downloadModuleAndExtract; } });
const runVirtualDir_1 = require("./runVirtualDir/runVirtualDir");
Object.defineProperty(exports, "runVirtualDir", { enumerable: true, get: function () { return runVirtualDir_1.runVirtualDir; } });
const builderApi = __importStar(require("../builderApi/builderApi"));
exports.builderApi = builderApi;
function closeSplash() {
    return (0, downloadModule_1.getModule)().then((module) => {
        module.controlWindow({
            controlcmd: "close",
            wndClassName: "mysplashclassname"
        });
    });
}
__exportStar(require("./downloadModule"), exports);
__exportStar(require("./ww2_server"), exports);
var dirnameTool_2 = require("./dirnameTool");
Object.defineProperty(exports, "findUserProjectRoot", { enumerable: true, get: function () { return dirnameTool_2.findUserProjectRoot; } });
