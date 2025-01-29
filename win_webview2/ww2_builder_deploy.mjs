// @ts-check

/** @typedef {import("./ww2_builder_type").ConfigWW2} ConfigWW2 */


import fs from 'fs'
import sharp from "sharp"
import path from "path";
import { logPrint } from "./ww2_builder_log.mjs";
import { fileURLToPath } from 'url';
import rcedit from "rcedit";
import  sharpsToIco  from "sharp-ico"


const jsonConfigFilePath = "./win_webview2.json";

export class WW2Deploy {

    /** @type {ConfigWW2 | null} */

    configObjec = null;

    /** @type {"x64" | "Win32" } */
    platform = "Win32";

    /** @type {string | null} */
    outputExeFile = null;



    async makeDistFolder() {

        if (this.configObjec == null) return;
        let config = this.configObjec;

        let folderDist = config.outdir;

        if (!fs.existsSync(folderDist)) {
            await fs.promises.mkdir(folderDist);
        }

        let libFolder = path.join(folderDist,"lib");
        if (!fs.existsSync(libFolder)) {
            await fs.promises.mkdir(libFolder);
        }
    }

    async buildIcon() {
        if (this.configObjec == null) return;

        let config = this.configObjec;

        let iconPath = config.icon_path;
        if (!fs.existsSync(iconPath)) {

            logPrint("icon notfound");
            return;

        }

        let outputIcon = path.join(config.outdir, "icon.ico");

        const sizes = [16, 32, 48, 256]; // Ukuran standar untuk rcedit
        const images = await Promise.all(sizes.map(size =>
            sharp(iconPath)
                .resize(size, size)
                .toFormat('png') 
        ));


        await sharpsToIco.sharpsToIco(images, outputIcon); 

        console.log('✅ Berhasil membuat icon.ico yang valid untuk rcedit!');

         
    }

    async copyExe() {
        let currentDirMjs = fileURLToPath(import.meta.url);
        let currentDir = path.dirname(currentDirMjs);

        if (this.configObjec == null) return;
        let config = this.configObjec;

        logPrint("COpy webview2 exe file");
        logPrint(currentDir);

        let inputFileExe = path.join(currentDir, "win_lib", this.platform, "CmdWebview2.exe");
       
        let outFileExe = path.join(config.outdir, config.appname + ".exe"); 
        this.outputExeFile = inputFileExe; 
        await fs.promises.copyFile(inputFileExe, outFileExe);

        let inputFileDll = path.join(currentDir, "win_lib", this.platform, "WebView2Loader.dll");
        let outFileDll = path.join(config.outdir,  "WebView2Loader.dll"); 
        await fs.promises.copyFile(inputFileDll, outFileDll);

        logPrint("copy file success");
    }

    async editIcon() {
        if (this.outputExeFile == null) return;
        if (this.configObjec == null) return;

        let object = this.configObjec;


        let iconPath = path.join(object.outdir, "icon.ico");
        iconPath = path.resolve(iconPath);

        await rcedit(this.outputExeFile, {
            icon: iconPath,
        });
    }

    async readConfig() {
        let str = await fs.promises.readFile(jsonConfigFilePath);
        let jsonObj = JSON.parse(str.toString());

        this.configObjec = jsonObj;
    }

    async copyNodeExe(){
        if(this.configObjec == null) return;
        let obj = this.configObjec;

        let inputNodeExe = process.execPath;
        let outNodeExe = path.join(obj.outdir,"lib","node.exe");
        await fs.promises.copyFile(inputNodeExe, outNodeExe);
    }

    async createIndexConf(){
        if(this.configObjec == null) return;
        let obj = this.configObjec;

        let oututFileConf = path.join(obj.outdir,"index.conf");

        let configCtn = `./lib/node.exe ./${obj.entry_point}`
        await fs.promises.writeFile(oututFileConf,configCtn);
    }
    
    static async initWW2() {
        /** @type {ConfigWW2} */

        let objConfig = {
            entry_point: "app.js",
            appname: "openweb",
            icon_path: "./icon.png",
            outdir: "./dist"
        }

        let objstr = JSON.stringify(objConfig, null, 2);
        await fs.promises.writeFile(jsonConfigFilePath, objstr);
    }



    static async startDeploy() {
        logPrint("Start Deploy win_webview2");
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