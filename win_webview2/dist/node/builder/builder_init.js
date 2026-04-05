"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ww2Init = ww2Init;
const dirnameTool_1 = require("../tsExport/dirnameTool");
const child_process_1 = require("child_process");
const prompts_1 = __importDefault(require("prompts"));
function runCommand(command) {
    try {
        const currentShell = process.platform === 'win32' ? 'cmd.exe' : '/bin/sh';
        (0, child_process_1.execSync)(command, { stdio: 'inherit', shell: currentShell, killSignal: "SIGINT" });
    }
    catch (error) {
        console.error(`Command Error: ${command}`);
        process.exit();
    }
}
const jsonConfigFilePath = "./win_webview2.json";
let mdirname = (0, dirnameTool_1.getWw2Dirname)();
let ww2Choise = {
    "ww2_typescript": {
        description: "init win_webview2",
        fun: async () => {
            runCommand('npx degit nnttoo/win_webview2/example/ww2_typescript#master ww2_typescript');
        }
    }
};
async function ww2Init() {
    const response = await (0, prompts_1.default)({
        type: 'select',
        name: 'menu',
        message: 'Pick one  example',
        instructions: '(Use arrow keys to navigate, press enter to select)',
        choices: (() => {
            let result = [];
            for (let item in ww2Choise) {
                let val = ww2Choise[item];
                result.push({
                    title: item,
                    value: val.fun,
                    description: val.description,
                });
            }
            return result;
        })(),
    });
    if (response && response.menu) {
        await response.menu();
    }
}
