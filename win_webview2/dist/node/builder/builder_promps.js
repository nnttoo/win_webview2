"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildForServer = buildForServer;
const prompts_1 = __importDefault(require("prompts"));
const builder_init_1 = require("./builder_init");
const userExec_1 = require("./userExec");
let ww2Choise = {
    "init_ww2": {
        description: "init win_webview2",
        fun: async () => {
            await (0, builder_init_1.ww2Init)();
        }
    }
};
async function buildForServer() {
    let userChoise = await (0, userExec_1.readUserScripts)();
    if (userChoise != null) {
        ww2Choise = {
            ...ww2Choise,
            ...userChoise
        };
    }
    const response = await (0, prompts_1.default)({
        type: 'select',
        name: 'menu',
        message: 'Pick one',
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
console.log("ww2 version : v6 \n\n");
const args = process.argv.slice(2);
if (args.length > 0) {
    let argument = args[0];
    if (argument.startsWith("--")) {
        argument = argument.substring(2);
    }
    console.log(argument);
    if (ww2Choise[argument]) {
        ww2Choise[argument].fun();
    }
}
else {
    buildForServer();
}
process.on('SIGINT', () => {
    console.log('\n[Sinyal SIGINT Terdeteksi]');
    console.log('User menekan Ctrl+C. Membersihkan data...');
    // Anda harus memanggil exit secara manual jika menggunakan listener ini
    process.exit(0);
});
