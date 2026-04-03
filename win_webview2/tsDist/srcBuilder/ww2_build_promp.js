"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildForServer = buildForServer;
const prompts_1 = __importDefault(require("prompts"));
const ww2_buildercore_1 = require("./ww2_buildercore");
async function buildForServer() {
    const response = await (0, prompts_1.default)({
        type: 'select',
        name: 'menu',
        message: 'Pilih menu',
        choices: [
            {
                title: 'init_webview2', value: async () => {
                    await ww2_buildercore_1.WW2Deploy.initWW2();
                }
            },
            {
                title: 'deploy', value: async () => {
                    await ww2_buildercore_1.WW2Deploy.startDeploy();
                }
            },
        ]
    });
    if (response && response.menu) {
        response.menu();
    }
}
buildForServer();
