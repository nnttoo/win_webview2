import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getDirname } from "./dirnameTool";
import { ConfigWW2, readConfig } from "./ww2_config";

interface Ww2WebConfig {
    callback: (err: any, data: any) => void;
    wclassname: string;
    url: string;
    title: string;

    width: number;
    height: number;
    isKiosk: boolean;
    isMaximize: boolean;
    isDebug: boolean;

}

interface WW2FileDialogArg {
    callback: (err: any, data: any) => void;
    filter: string;
    ownerClassName: string;
}

export interface WW2ControlWindowsArg {
    wndClassName: string;
    controlcmd: "close" | "move" | "maximize" | "minimize" | "resize" | "check",
    left?: number;
    top?: number;
    height?: number;
    width?: number;
}

interface Ww2Module {
    openWeb: (arg: Ww2WebConfig) => void;
    openFileDialog: (arg: WW2FileDialogArg) => void;
    openFolderDialog: (arg: WW2FileDialogArg) => void;
    controlWindow: (arg: WW2ControlWindowsArg) => void;
}



export async function getModule() {
    let dirname = getDirname();

    let filepath = path.join(
        dirname._dirname,
        "./ww2_addon.node"
    );

    if (!existsSync(filepath)) {

        let config = await readConfig();
        filepath = path.join(dirname._dirname, `../../../win_lib/${config.platform}/ww2_addon.node`);

    }

    let myAddon = require(filepath) as Ww2Module;
    return myAddon;
}

export * from "./ww2_server"