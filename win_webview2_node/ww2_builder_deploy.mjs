// @ts-check

/** @typedef {import("./ww2_builder_type").ConfigWW2} ConfigWW2 */


import fs from 'fs'
import sharp from "sharp"
import path from "path";
import { logPrint } from "./ww2_builder_log.mjs";
import { fileURLToPath } from 'url';


const jsonConfigFilePath = "./win_webview2.json";

export class WW2Deploy {

    /** @type {ConfigWW2 | null} */

    configObjec = null;

    /** @type {"x64" | "Win32" } */
    platform = "Win32";

    async makeDistFolder() {

        if (this.configObjec == null) return; 
        let config = this.configObjec;

        let folderDist = config.outdir;
        if (!fs.existsSync(folderDist)) {
            await fs.promises.mkdir(folderDist);
        }
    }

    buildIcon() {
        if (this.configObjec == null) return;

        let config = this.configObjec;

        let iconPath = config.icon_path;
        if (!fs.existsSync(iconPath)) {

            logPrint("icon notfound");
            return;

        }

        let outputIcon = path.join(config.outdir, "icon.ico");

        return new Promise((r, x) => {
            sharp(iconPath).resize(64, 64).toFile(outputIcon, (err, info) => {
                if (err) {
                    x(err);
                } else {
                    console.log('Icon created:', info);
                    r("");
                }
            });

        });
    }

    async copyExe(){ 
        let currentDirMjs = fileURLToPath(import.meta.url);
        let currentDir = path.dirname(currentDirMjs);

        if(this.configObjec == null) return;
        let config = this.configObjec;

        logPrint("COpy webview2 exe file");
        logPrint(currentDir); 
        
        let exeFile = path.join(currentDir,"win_lib",this.platform,"CmdWebview2.exe");
        let exeOutFile = path.join(config.outdir,config.appname + ".exe");

        await fs.promises.copyFile(exeFile,exeOutFile);
    }

    async readConfig() {
        let str = await fs.promises.readFile(jsonConfigFilePath);
        let jsonObj = JSON.parse(str.toString());

        this.configObjec = jsonObj;
    }

    static async initWW2() {
        /** @type {ConfigWW2} */

        let objConfig = {
            entry_point: "./dist/app.js",
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

    }
}