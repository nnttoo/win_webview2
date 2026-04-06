import { exec } from "node:child_process";
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { getWw2Dirname } from "../tsExport/dirnameTool";

function debugDir(dirPath: string) {
    exec("cd " + dirPath + "&& dir", (s, o) => {
        console.log(o);
    })
}

(async () => {

    let result = "\n";

    let dirname = getWw2Dirname();

    let ww2ModulePath = dirname.ww2ModulePath;
 
    let copyFromRoot = async (src: string, target: string) => {
        try {

            let rootPath = path.join(ww2ModulePath,"../");
            console.log("ModulePath : ", ww2ModulePath);
            console.log("rootPath : ", rootPath);
            result += "\n" + target;
            await copyFile(path.join(rootPath, src), path.join(rootPath, target));
        } catch (error) {
            console.log(error);
        }
    }
    
    try{ 
        await mkdir(path.join(ww2ModulePath, "win_lib"));

    } catch{

    }
    try{ 
        await mkdir(path.join(ww2ModulePath, "win_lib/Win32"));

    } catch{

    }

    try {

        await mkdir(path.join(ww2ModulePath, "win_lib/x64"));
    } catch (error) {

    }

    await copyFromRoot(
        "exeOpener/build/x64/exeOpenner.exe",
        "win_webview2/win_lib/x64/exeOpenner.exe"
    );
    await copyFromRoot(
        "exeOpener/build/x64/splash.png",
        "win_webview2/win_lib/x64/splash.png"
    );

    await copyFromRoot(
        "exeOpener/build/x86/exeOpenner.exe",
        "win_webview2/win_lib/Win32/exeOpenner.exe"
    );
    await copyFromRoot(
        "exeOpener/build/x86/splash.png",
        "win_webview2/win_lib/Win32/splash.png"
    );

    console.log("copy webview2 32");
    await copyFromRoot(
        "nodeAddOn/build/ia32/Release/ww2_addon.node",
        "win_webview2/win_lib/Win32/ww2_addon.node"
    );
    await copyFromRoot(
        "nodeAddOn/build/ia32/Release/WebView2Loader.dll",
        "win_webview2/win_lib/Win32/WebView2Loader.dll"
    );

    console.log("copy webview2 64");
    await copyFromRoot(
        "nodeAddOn/build/x64/Release/ww2_addon.node",
        "win_webview2/win_lib/x64/ww2_addon.node"
    );
    await copyFromRoot(
        "nodeAddOn/build/x64/Release/WebView2Loader.dll",
        "win_webview2/win_lib/x64/WebView2Loader.dll"
    );



    console.log("copy done :" + result);

})();