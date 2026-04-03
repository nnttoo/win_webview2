"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WW2Deploy = void 0;
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const rcedit_1 = __importDefault(require("rcedit"));
const sharp_ico_1 = __importDefault(require("sharp-ico"));
const logprint_1 = require("../logprint");
const build_copyDir_1 = require("./build_copyDir");
const jsonConfigFilePath = "./win_webview2.json";
class WW2Deploy {
    async makeDistFolder() {
        if (this.configObjec == null)
            return;
        let config = this.configObjec;
        let folderDist = config.outdir;
        if (!fs_1.default.existsSync(folderDist)) {
            await fs_1.default.promises.mkdir(folderDist);
        }
        let libFolder = path_1.default.join(folderDist, "lib");
        if (!fs_1.default.existsSync(libFolder)) {
            await fs_1.default.promises.mkdir(libFolder);
        }
    }
    async buildIcon() {
        if (this.configObjec == null)
            return;
        let config = this.configObjec;
        let iconPath = config.icon_path;
        if (!fs_1.default.existsSync(iconPath)) {
            (0, logprint_1.logPrint)("icon notfound");
            return;
        }
        let outputIcon = path_1.default.join(config.outdir, "icon.ico");
        const sizes = [16, 32, 48, 256]; // Ukuran standar untuk rcedit
        const images = await Promise.all(sizes.map(size => (0, sharp_1.default)(iconPath)
            .resize(size, size)
            .toFormat('png')));
        await sharp_ico_1.default.sharpsToIco(images, outputIcon);
        console.log('✅ Berhasil membuat icon.ico yang valid untuk rcedit!');
    }
    async copyExe() {
        let currentDir = path_1.default.join(__dirname, "../../");
        if (this.configObjec == null)
            return;
        let config = this.configObjec;
        let platform = config.platform;
        let inputDir = path_1.default.join(currentDir, "win_lib", platform);
        this.outputExeFile = path_1.default.join(config.outdir, config.appname + ".exe");
        await (0, build_copyDir_1.copyDir)(inputDir, config.outdir);
        await promises_1.default.rename(path_1.default.join(config.outdir, "CmdWebview2.exe"), this.outputExeFile);
        await (async () => {
            let inputFileDll = jsonConfigFilePath;
            let outFileDll = path_1.default.join(config.outdir, "win_webview2.json");
            await fs_1.default.promises.copyFile(inputFileDll, outFileDll);
        })();
        (0, logprint_1.logPrint)("copy file success");
    }
    async editIcon() {
        if (this.outputExeFile == null)
            return;
        if (this.configObjec == null)
            return;
        let object = this.configObjec;
        let iconPath = path_1.default.join(object.outdir, "icon.ico");
        iconPath = path_1.default.resolve(iconPath);
        await (0, rcedit_1.default)(this.outputExeFile, {
            icon: iconPath,
        });
    }
    async readConfig() {
        let str = await fs_1.default.promises.readFile(jsonConfigFilePath);
        let jsonObj = JSON.parse(str.toString());
        this.configObjec = jsonObj;
    }
    async copyNodeExe() {
        if (this.configObjec == null)
            return;
        let obj = this.configObjec;
        let inputNodeExe = process.execPath;
        let outNodeExe = path_1.default.join(obj.outdir, "lib", "node.exe");
        await fs_1.default.promises.copyFile(inputNodeExe, outNodeExe);
    }
    async createIndexConf() {
        if (this.configObjec == null)
            return;
        let obj = this.configObjec;
        let oututFileConf = path_1.default.join(obj.outdir, "index.bat");
        let configCtn = `.\\\\lib\\\\node.exe ./${obj.entry_point}`;
        await fs_1.default.promises.writeFile(oututFileConf, configCtn);
    }
    static async initWW2() {
        let objConfig = {
            entry_point: "app.js",
            appname: "openweb",
            icon_path: "./icon.png",
            outdir: "./dist",
            platform: 'Win32'
        };
        let objstr = JSON.stringify(objConfig, null, 2);
        if (fs_1.default.existsSync(jsonConfigFilePath)) {
            (0, logprint_1.logPrint)("file config is exits");
            return;
        }
        await fs_1.default.promises.writeFile(jsonConfigFilePath, objstr);
    }
    static async startDeploy() {
        (0, logprint_1.logPrint)("Start Deploy win_webview2");
        let c = new WW2Deploy();
        await c.readConfig();
        await c.makeDistFolder();
        await c.buildIcon();
        await c.copyExe();
        await c.editIcon();
        await c.copyNodeExe();
        await c.createIndexConf();
    }
}
exports.WW2Deploy = WW2Deploy;
