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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLauncher = createLauncher;
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const dirnameTool_1 = require("../tsExport/dirnameTool");
const sharp_1 = __importDefault(require("sharp"));
const sharp_ico_1 = require("sharp-ico");
const PELibrary = __importStar(require("pe-library"));
const ResEdit = __importStar(require("resedit"));
async function createDir(dirpath) {
    if (!(0, node_fs_1.existsSync)(dirpath)) {
        try {
            await (0, promises_1.mkdir)(dirpath, { recursive: true });
        }
        catch (error) {
        }
    }
}
async function createIcoFile(arg) {
    let iconPath = arg.pngPath;
    if (!(0, node_fs_1.existsSync)(iconPath)) {
        console.log("icon not found");
        return;
    }
    let outputIcon = arg.icoPath;
    const sizes = [16, 32, 48, 256]; // Ukuran standar untuk rcedit
    const images = await Promise.all(sizes.map(size => (0, sharp_1.default)(iconPath)
        .resize(size, size)
        .toFormat('png')));
    await (0, sharp_ico_1.sharpsToIco)(images, outputIcon);
}
async function createLauncher(arg) {
    if (arg.platform == null) {
        arg.platform = "x64";
    }
    let exeTempPath = arg.outPath + '.temp.exe';
    let exeReal = arg.outPath;
    let outDirPath = node_path_1.default.dirname(arg.outPath);
    await createDir(outDirPath);
    let wwvPath = (0, dirnameTool_1.getWWVNodeModuleFolder)();
    await (async () => {
        console.log("copy launcer");
        let launcerPath = node_path_1.default.join(wwvPath, "win_lib/" + arg.platform + "/appLauncher.exe");
        await (0, promises_1.copyFile)(launcerPath, exeTempPath);
    })();
    console.log("copy splash file");
    await (0, promises_1.copyFile)(arg.splashPath, node_path_1.default.join(outDirPath, "splash.png"));
    await (async () => {
        console.log("create ico file");
        let icoPath = node_path_1.default.join(outDirPath, "icon.ico");
        await createIcoFile({
            pngPath: arg.iconPath,
            icoPath: icoPath
        });
        console.log("edit file icon");
        let iconBin = await (0, promises_1.readFile)(icoPath);
        const iconFile = ResEdit.Data.IconFile.from(iconBin);
        let exeData = await (0, promises_1.readFile)(exeTempPath);
        let exe = PELibrary.NtExecutable.from(exeData);
        let res = PELibrary.NtExecutableResource.from(exe);
        ResEdit.Resource.IconGroupEntry.replaceIconsForResource(res.entries, 101, // ID Icon Group yang mau diganti (biasanya 101 atau 1)
        1033, // Language ID
        iconFile.icons.map((item) => item.data) // Mengambil data biner dari tiap ukuran icon
        );
        const myScript = arg.script;
        const scriptUint8 = new TextEncoder().encode(myScript);
        const scriptEntry = {
            type: 10, // RT_RCDATA
            id: 'MY_SCRIPT', // Gunakan 'id' sesuai hasil print kamu
            lang: 1033,
            codepage: 0,
            bin: scriptUint8.buffer // Ambil ArrayBuffer-nya
        };
        res.entries.push(scriptEntry);
        res.outputResource(exe);
        const newBinary = exe.generate();
        await (0, promises_1.writeFile)(exeReal, Buffer.from(newBinary));
        await (0, promises_1.rm)(exeTempPath);
    })();
}
