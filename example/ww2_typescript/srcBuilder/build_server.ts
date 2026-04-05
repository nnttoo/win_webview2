import * as esbuild from 'esbuild'
import path from 'node:path';
import { findUserProjectRoot, readConfig } from 'win_webview2/node';

async function getESBUildOption(): Promise<esbuild.BuildOptions> {

    let projectPath = findUserProjectRoot();
    if(projectPath == null) projectPath = "./"

    let ww2Config = await readConfig();

    if(ww2Config == null) throw "config is null";

    let outFile = path.join(
        projectPath,
        ww2Config.outdir,
        "lib", 
        ww2Config.entry_point,
    )

    return {
        entryPoints: [path.join("./srcNode", "app.ts")],
        bundle: true,
        outfile: outFile,
        platform: 'node',  // Agar sesuai dengan Node.js
        sourcemap: false,
        target: 'es6',
        minify: true,
        format: 'cjs',
        external: [],
        define: {
            __BUILD_DATE__: JSON.stringify(new Date().toLocaleString()),
            __ISDEV__: JSON.stringify(false),
            __ISSERVER__: JSON.stringify(true)
        },
        plugins: []
    }
}

async function buildServer() {
    let buildOption = await getESBUildOption();
    await esbuild.build(buildOption);

    console.log('🖥️ Backend build sukses!');
}


async function buildServerWatch() {
    console.log("\n\nStart Server Build Watch");
    let buildOption = await getESBUildOption();

    if(buildOption.plugins == null) return;

    buildOption.plugins.push({
        name: 'rebuild-notify',
        setup(build) {
            build.onEnd(result => {
                console.log("🖥️ after build server watch");
            })
        },
    })

    const ctx = await esbuild.context(buildOption);
    await ctx.watch();
}


async function build() {
 

    if (process.argv.includes("--watch")) {
        console.log("ini build browserwatch");
        await buildServerWatch();
        return;
    } else {
        await buildServer();
    }



}

build();