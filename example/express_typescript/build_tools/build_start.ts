
import { copyFile, mkdir, readFile, rm } from "fs/promises";

import prompts from 'prompts';
import { execProg } from "./build_execc"; 
import { BuildConfig } from "./build_config";
import { WW2Deploy } from "../../../win_webview2/ww2_builder_deploy.mjs";

export async function buildForServer() {
    const response = await prompts({
        type: 'select',
        name: 'menu',
        message: 'Pilih menu',
        choices: [
            {
                title: 'buildAll', value: async () => {
                    WW2Deploy.startDeploy();

                }
            },

            {
                title: 'buildBrowser', value: () => {

                }
            },
            {
                title: 'cleanDistFolder', value: async () => {
                    await rm(BuildConfig.distRoot, { recursive: true, force: true });
                }
            },
        ]
    });
    if (response && response.menu) {

        response.menu();
    }
}

buildForServer();