
import prompts from 'prompts';
import { WW2Deploy } from './ww2_buildercore';
export async function buildForServer() {
    const response = await prompts({
        type: 'select',
        name: 'menu',
        message: 'Pilih menu',
        choices: [
            {
                title: 'init_webview2', value: async () => {

                    await WW2Deploy.initWW2();
                }
            }, 
            {
                title: 'deploy', value: async () => {

                    await WW2Deploy.startDeploy();
                }
            }, 
        ]
    });
    if (response && response.menu) {

        response.menu();
    }
}

buildForServer();