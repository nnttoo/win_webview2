"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildForServer = buildForServer;
const prompts_1 = __importDefault(require("prompts"));
const builder_init_1 = require("./builder_init");
let ww2Choise = {
    "init_ww2": async () => {
        await (0, builder_init_1.ww2Init)();
    },
    deploy: async () => {
    }
};
async function buildForServer() {
    const response = await (0, prompts_1.default)({
        type: 'select',
        name: 'menu',
        message: 'Pilih menu',
        choices: (() => {
            let result = [];
            for (let item in ww2Choise) {
                let val = ww2Choise[item];
                result.push({
                    title: item,
                    value: val
                });
            }
            return result;
        })(),
    });
    if (response && response.menu) {
        response.menu();
    }
}
console.log("ww2 version : v5 \n\n");
const args = process.argv.slice(2);
if (args.length > 0) {
    let argument = args[0];
    if (argument.startsWith("--")) {
        argument = argument.substring(2);
    }
    console.log(argument);
    if (ww2Choise[argument]) {
        ww2Choise[argument]();
    }
}
else {
    buildForServer();
}
