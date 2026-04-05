import { existsSync } from "fs";
import { copyFile, mkdir, readFile, writeFile } from "fs/promises";
import { getWw2Dirname } from "../tsExport/dirnameTool";
import path from "path";
import { exec, execSync } from "child_process";
import { ConfigWW2 } from "../tsExport/ww2_config";
import prompts from "prompts";
 

function runCommand(command : string) {
  try { 
    const currentShell = process.platform === 'win32' ? 'cmd.exe' : '/bin/sh'; 
    execSync(command, { stdio: 'inherit', shell: currentShell, killSignal : "SIGINT" });
  } catch (error) {
    console.error(`Command Error: ${command}`);
    process.exit();
  }
}

const jsonConfigFilePath = "./win_webview2.json";
let mdirname = getWw2Dirname();
 

interface ChoiseItem {
    fun: () => any;
    description: string;
}

export type WW2Choise = { [key: string]: ChoiseItem }

let ww2Choise: WW2Choise = {

    "ww2_typescript": {
        description: "init win_webview2",
        fun: async () => {
             runCommand('npx degit nnttoo/win_webview2/example/ww2_typescript#master ww2_typescript')
        }
    } 
}


type promChoise = {
    title: string,
    value: () => any,
    description: string,
    disable? :boolean
}

export async function ww2Init() {
     const response = await prompts({
             type: 'select',
             name: 'menu',
             message: 'Pick one  example',
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