"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readUserScripts = readUserScripts;
const node_path_1 = __importDefault(require("node:path"));
const dirnameTool_1 = require("../tsExport/dirnameTool");
const promises_1 = require("node:fs/promises");
const comment_json_1 = require("comment-json");
const node_child_process_1 = require("node:child_process");
function runNpm(command) {
    try {
        const currentShell = process.platform === 'win32' ? 'cmd.exe' : '/bin/sh';
        let cmd = `npm run ${command}`;
        console.log(cmd);
        (0, node_child_process_1.execSync)(cmd, { stdio: 'inherit', shell: currentShell, killSignal: "SIGINT" });
    }
    catch (error) {
        console.error(`Command Error: ${command}`);
        process.exit();
    }
}
async function readUserScripts() {
    let dirUser = (0, dirnameTool_1.findUserProjectRoot)();
    if (dirUser == null)
        return;
    let pkgJson = node_path_1.default.join(dirUser, "package.json");
    let pkgTxt = await (0, promises_1.readFile)(pkgJson, "utf-8");
    let obj = (0, comment_json_1.parse)(pkgTxt);
    if (obj.scripts == null)
        return;
    let ww2Choise = {};
    let name = obj.name ? obj.name : "";
    for (let kscript in obj.scripts) {
        let cmd = obj.scripts[kscript];
        ww2Choise["--" + kscript] = {
            description: name + " : " + cmd,
            fun: () => {
                runNpm(kscript);
            }
        };
    }
    return ww2Choise;
}
