import {   getWWVNodeModuleFolder } from "./dirnameTool";
import { readConfig } from "./ww2_config";
import { downloadModuleAndExtract, getModule } from "./downloadModule";
import { runVirtualDir } from "./runVirtualDir";
 

export function closeSplash(){
    return getModule().then((module)=>{
        module.controlWindow({
            controlcmd : "close",
            wndClassName : "mysplashclassname"
        })
    });
}
 

export * from "./downloadModule"

export * from "./ww2_server"
export {findUserProjectRoot } from "./dirnameTool"
export {readConfig} ; 
export {getWWVNodeModuleFolder, downloadModuleAndExtract, runVirtualDir}


