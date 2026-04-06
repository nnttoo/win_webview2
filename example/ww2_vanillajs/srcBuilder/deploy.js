 //@ts-check

const {   findUserProjectRoot, readConfig, getWWVNodeModuleFolder } = require("win_webview2/node");
const path = require("path");
const { existsSync } = require("fs");
const { mkdir, copyFile, writeFile } = require("fs/promises");
const sharp = require("sharp");
const ico = require("sharp-ico");
const rcedit = require("rcedit");
const { copyDir } = require("./copyDir");
const packageJson = require('../package.json');
const { execSync } = require("child_process");

/**
 * 
 * @param {string} command 
 */
function runCommand(command) {
    try {
        const currentShell = process.platform === 'win32' ? 'cmd.exe' : '/bin/sh';
        execSync(command, { stdio: 'inherit', shell: currentShell, killSignal: "SIGINT" });
    } catch (error) {
        console.error(`Command Error: ${command}`);
        process.exit();
    }
}


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

        /**
         * 
         * @param {string} strFolder 
         */
        async function safeMkdirDist(strFolder) {
            let libFolder = path.join(folderDist, strFolder);
            if (!existsSync(libFolder)) {
                await mkdir(libFolder);
            }
        }

        await safeMkdirDist("lib"); 
        await safeMkdirDist("lib"); 



    })();


    await (async () => {

        console.log("make icon");
        let iconPath = path.join(userRootProject, "./assets/icon.png");
        if (!existsSync(iconPath)) {
            console.log("icon not found");
            return;
        }

        let outputIcon = path.join(ww2ConfigObj.outdir, "/lib/icon.ico");

        const sizes = [16, 32, 48, 256]; // Ukuran standar untuk rcedit
        const images = await Promise.all(sizes.map(size =>
            sharp(iconPath)
                .resize(size, size)
                .toFormat('png')
        ));


        await ico.sharpsToIco(images, outputIcon);
    })();

    await (async () => {
        console.log("copy node exe");

        let inputNodeExe = process.execPath;
        let outNodeExe = path.join(ww2ConfigObj.outdir, "lib", "node.exe");
        await copyFile(inputNodeExe, outNodeExe);


    })();

    let runnerOutPath = path.join(
        folderDist,
        ww2ConfigObj.appname + ".exe"
    )

    await (async () => {
        console.log("copy runner exe"); 
        let runnerPath = path.join(
            wwvNodeModulePath,
            "win_lib",
            ww2ConfigObj.platform,
            "exeOpenner.exe"
        );




        await copyFile(runnerPath, runnerOutPath);
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
        console.log("create bat file");

        let batfilePath = path.join(folderDist, "index.bat");

        let bathCtn = `
        .\\\\lib\\\\node.exe ./lib/${ww2ConfigObj.entry_point}
        `

        await writeFile(batfilePath, bathCtn);

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
        /**
         * 
         * @param {string} fileName 
         */
        let copyFromWinLib = async (fileName) => {
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

    await (async () => {
        console.log("edit icon");
        let iconPath = path.join(
            folderDist,
            "lib",
            "icon.ico"
        );
        iconPath = path.resolve(iconPath);

        await rcedit(runnerOutPath, {
            icon: iconPath,
        });
    })();

    
    await copyFile(
        path.join(
            userRootProject,
            "srcNode/app.js"
        ),
        path.join(
            folderDist,
            "lib/app.js"
        )
    )

    await(async()=>{ 
        let packageObj = {...packageJson};
        // @ts-ignore
        delete packageJson.devDependencies; 

        let ctn = JSON.stringify(packageJson,null,2);

        let pdist = path.join(folderDist,"lib/package.json");

        await writeFile(
            pdist,
            ctn
        )

    })();

    let libFolder = path.resolve(path.join(folderDist,"lib"));

    runCommand(`cd "${libFolder}" && npm install `);

    console.log("copy icon folder")
     
}
deploy();