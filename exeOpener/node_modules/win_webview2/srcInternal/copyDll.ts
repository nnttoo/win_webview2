import { exec } from "node:child_process";
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path"; 

function debugDir(dirPath: string) {
    exec("cd " + dirPath + "&& dir", (s, o) => {
        console.log(o);
    })
}

(async () => {

    let result = "\n";

    let ww2SourcePath = path.join(__dirname,"../");
 
    let copyFromRoot = async (src: string, target: string) => {
        try {

            let rootPath = path.join(ww2SourcePath,"../");
            console.log("ModulePath : ", ww2SourcePath);
            console.log("rootPath : ", rootPath);
            result += "\n" + target;
            await copyFile(path.join(rootPath, src), path.join(rootPath, target));
        } catch (error) {
            console.log(error);
        }
    }
    
    try{ 
        await mkdir(path.join(ww2SourcePath, "win_lib"));

    } catch{

    }
    try{ 
        await mkdir(path.join(ww2SourcePath, "win_lib/x86"));

    } catch{

    }

    try {

        await mkdir(path.join(ww2SourcePath, "win_lib/x64"));
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
        "win_webview2/win_lib/x86/exeOpenner.exe"
    );
    await copyFromRoot(
        "exeOpener/build/x86/splash.png",
        "win_webview2/win_lib/x86/splash.png"
    );

    console.log("copy webview2 32");
    await copyFromRoot(
        "nodeAddOn/build/ia32/Release/ww2_addon.node",
        "win_webview2/win_lib/x86/ww2_addon.node"
    );
    await copyFromRoot(
        "nodeAddOn/build/ia32/Release/WebView2Loader.dll",
        "win_webview2/win_lib/x86/WebView2Loader.dll"
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