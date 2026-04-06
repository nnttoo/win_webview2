"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ww2Init = ww2Init;
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
let ww2Choise = {
    "ww2_typescript": {
        description: "init win_webview2",
        fun: async () => {
            runCommand('npx degit nnttoo/win_webview2/example/ww2_typescript#master ww2_typescript');
        }
    }
};
async function fetchFromList() {
    try {
        console.log("get list example");
        let url = "https://raw.githubusercontent.com/nnttoo/win_webview2/refs/heads/master/example/listexample.json";
        let txt = await fetch(url);
        let content = await txt.text();
        let obj = JSON.parse(content);
        for (let item of obj) {
            ww2Choise[item.path] = {
                description: item.desctiption,
                fun: () => {
                    runCommand(`npx degit nnttoo/win_webview2/example/${item.path}#master ${item.path}`);
                }
            };
        }
    }
    catch (error) {
    }
}
async function ww2Init() {
    await fetchFromList();
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
