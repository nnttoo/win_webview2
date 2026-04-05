
import prompts from 'prompts'; 
import { ww2Init } from './builder_init';
import { readUserScripts } from './userExec';

interface ChoiseItem {
    fun: () => any;
    description: string;
}

export type WW2Choise = { [key: string]: ChoiseItem }

let ww2Choise: WW2Choise = {

    "init_ww2": {
        description: "init win_webview2",
        fun: async () => {
            await ww2Init();
        }
    } 
}

type promChoise = {
    title: string,
    value: () => any,
    description: string,
    disable? :boolean
}

export async function buildForServer() {
    let userChoise = await readUserScripts();
    if(userChoise != null){
        ww2Choise = {
            ...ww2Choise,
            ...userChoise
        }
    }

    const response = await prompts({
        type: 'select',
        name: 'menu',
        message: 'Pick one',
        instructions: '(Use arrow keys to navigate, press enter to select)',
        choices: (() => {
            let result: promChoise[] = [];

            for (let item in ww2Choise) {
                let val = ww2Choise[item];

                result.push({
                    title: item,
                    value: val.fun,
                    description : val.description,
                });
            } 
            return result;


        })(),
    });
    if (response && response.menu) {

       await  response.menu();
    }
}
console.log("ww2 version : v6 \n\n");
const args = process.argv.slice(2);


if (args.length > 0) {

    let argument = args[0] as string;
    if (argument.startsWith("--")) {
        argument = argument.substring(2);
    }

    console.log(argument);
    if (ww2Choise[argument]) {
        ww2Choise[argument].fun();
    }

} else {

    buildForServer();
}

process.on('SIGINT', () => {
  console.log('\n[Sinyal SIGINT Terdeteksi]');
  console.log('User menekan Ctrl+C. Membersihkan data...');
  
  // Anda harus memanggil exit secara manual jika menggunakan listener ini
  process.exit(0); 
});