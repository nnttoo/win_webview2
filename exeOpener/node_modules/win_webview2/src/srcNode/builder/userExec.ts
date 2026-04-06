import path from "node:path";
import { findUserProjectRoot } from "../tsExport/dirnameTool";
import { readFile } from "node:fs/promises";
import { parse } from "comment-json";
import { WW2Choise } from "./builder_promps";
import { execSync } from "node:child_process";

interface MyPkg{
    name? : string,
    scripts? : {[key : string] : string} 
}

function runNpm(command : string) {
  try { 
    const currentShell = process.platform === 'win32' ? 'cmd.exe' : '/bin/sh';
    let cmd = `npm run ${command}`;
    console.log(cmd);
    execSync(cmd, { stdio: 'inherit', shell: currentShell, killSignal : "SIGINT" });
  } catch (error) {
    console.error(`Command Error: ${command}`);
    process.exit();
  }
}

export async function readUserScripts(){
    let dirUser = findUserProjectRoot();
    if(dirUser == null) return;

    let pkgJson = path.join(dirUser, "package.json");
    let pkgTxt = await readFile(pkgJson,"utf-8");

    let obj = parse(pkgTxt) as MyPkg;
 
    if(obj.scripts == null) return;

    let ww2Choise : WW2Choise = {};

    let name = obj.name? obj.name : "";

    for(let kscript in obj.scripts){
        let cmd = obj.scripts[kscript];

        ww2Choise["--"+kscript] = {
            description :  name + " : " + cmd,
            fun : ()=>{
                runNpm(kscript);
            }
        }

    }

    return ww2Choise;

}