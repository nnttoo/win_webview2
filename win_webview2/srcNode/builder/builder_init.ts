import { existsSync } from "fs";
import { copyFile, mkdir, readFile, writeFile } from "fs/promises";
import { getDirname } from "./dirnameTool";
import path from "path";
import { exec } from "child_process";

export type ConfigWW2 = {
    appname: string;
    entry_point: string;
    outdir: string;
    platform: 'Win32' | 'x64'
};


const jsonConfigFilePath = "./win_webview2.json";
let mdirname = getDirname();

let ww2ModulePath = path.join(mdirname._dirname, "../../../");

export async function ww2Init() {
    let ww2Config: ConfigWW2 = {
        entry_point: "app.js",
        appname: "openweb",
        outdir: "./dist",
        platform: 'x64'
    }

    let objstr = JSON.stringify(ww2Config, null, 2);
    if (!existsSync(jsonConfigFilePath)) {

        await writeFile(jsonConfigFilePath, objstr);
    } else {
        let str = await readFile(jsonConfigFilePath, "utf-8");
        ww2Config = JSON.parse(str);
    }

    console.log(ww2Config);


    if (!existsSync("./assets")) {

        await mkdir("./assets");
    }


    await copyFile(
        path.join(ww2ModulePath, "win_lib/x64/splash.png"),
        path.join("./assets/icon.png")
    );


    try {

        await mkdir(path.join("./assets", "html"));
    } catch (error) {

    }
    await writeFile(
        path.join("./assets", "/html/index.html"),
        `
 <!DOCTYPE html>
<html>

<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <link rel="stylesheet" href="/bootstrap.css?v=9">
    <title>${ww2Config.appname}</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>

</head>
<body>
<div id="app"></div>
<script src="/app_browser.js"></script>
</body>
</html>       
        `
    )

}