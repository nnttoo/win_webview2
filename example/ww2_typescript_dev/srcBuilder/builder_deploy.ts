import { existsSync } from "node:fs";
import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp"
import ico from "sharp-ico"
import rcedit from "rcedit";
import { builderApi, findUserProjectRoot,  getWWVNodeModuleFolder, readConfig } from "win_webview2/node";
import { copyDir } from "./build_copyDir"; 

import pkgJson from "../package.json"

async function deploy() {
    console.log("start deploy");
 
    let wwvNodeModulePath = getWWVNodeModuleFolder();


    let userRootProject = findUserProjectRoot();
    if (userRootProject == null) {
        throw "user root project not found";
    }

    let ww2ConfigObj = await readConfig();
    if (ww2ConfigObj == null) {
        throw "ww2 Config null";
    }


    let folderDist = path.join(userRootProject, ww2ConfigObj.outdir);

    await (async () => {

        console.log("make dist folder");

        if (!existsSync(folderDist)) {
            await mkdir(folderDist);
        }

        async function safeMkdirDist(strFolder: string) {
            let libFolder = path.join(folderDist, strFolder);
            if (!existsSync(libFolder)) {
                await mkdir(libFolder);
            }
        }

        await safeMkdirDist("lib"); 
        await safeMkdirDist("lib"); 



    })();

    await builderApi.createLauncher({
        iconPath : path.join(userRootProject,"./assets/icon.png"),
        splashPath : path.join(userRootProject,"./assets/splash.png"),
        outPath : path.join(folderDist, ww2ConfigObj.appname + ".exe"),
        platform : ww2ConfigObj.platform,
        script  : ` .\\\\lib\\\\node.exe ./lib/${ww2ConfigObj.entry_point}`
    });
 

    await copyFile(
        path.join(folderDist,"icon.ico"),
        path.join(folderDist,"lib","icon.ico")
    );

    await rm(path.join(folderDist,"icon.ico"));

    await (async () => {
        console.log("copy node exe");

        let inputNodeExe = process.execPath;
        let outNodeExe = path.join(ww2ConfigObj.outdir, "lib", "node.exe");
        await copyFile(inputNodeExe, outNodeExe);


    })(); 
    

    await (async () => {
        console.log("copy Assets");

        let from = path.join(
            userRootProject,
            "assets"
        );
        let to = path.join(
            folderDist 
        ) 

        await copyDir(from, to);

    })(); 


    await (async () => {
        console.log("create json config ");
        let configPath = path.join(
            folderDist,
            "lib", 
            "win_webview2.json",
        );

        let configctn = JSON.stringify(ww2ConfigObj, null, 2);
        writeFile(configPath, configctn);
    })();

    await (async () => {
        let copyFromWinLib = async (fileName: string) => {
            console.log("copy node modules " + fileName);
            let nodePath = path.join(
                wwvNodeModulePath,
                "win_lib",
                ww2ConfigObj.platform,
                fileName
            );

            let out = path.join(
                folderDist,
                "lib",
                fileName
            );

            await copyFile(nodePath,out); 

        }

        await copyFromWinLib("ww2_addon.node");
        await copyFromWinLib("WebView2Loader.dll");



    })(); 

    await (async ()=>{
        console.log("create package json"); 
        pkgJson.devDependencies = {} as any;

        let str = JSON.stringify(pkgJson,null, 2);
        let outPath = path.join(folderDist,"/lib/package.json");
        await writeFile(outPath,str);
    })();

} 

deploy();