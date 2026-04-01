import * as esbuild from 'esbuild'

import vuePlugin from "esbuild-plugin-vue3";
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
import path from 'path';
import stylePlugin from 'esbuild-style-plugin'
import { WebSocketServer } from "ws";
import tailwindConfig from "../srcBrowser/tailwind.config.js"

import { externalGlobalPlugin } from "esbuild-plugin-external-global";
import { BuildConfig } from './build__config.js';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { OpenLayerEsBuildGlobal } from './openlayer/build_ol';
import { buildIcon, buildIconWatch } from '../srcBrowser/iconbuilder/builder_icon.js';
import { languageBuild, languageBuildWatch } from '../srcBrowser/language/builder.js';


let fileInputJsBrowser = path.join(BuildConfig.srcBrowser, "index.ts");
let fileOutJsBrowser = path.join(BuildConfig.distNodeAppPublic, "app_browser.js");
let fileOutLanguage = path.join(BuildConfig.distNodeAppPublic, "language.json");

let folderPublicSrc = BuildConfig.asetFolderPublic;
let folderPublicDst = BuildConfig.distNodeAppPublic;

function createOption(fileInput) {
    let srcTailwind = (() => {
        var list = [
            path.dirname(fileInput) + "/**/*.{vue,ts}"
        ];


        console.log(list);
        return list;
    })();

    tailwindConfig.content = srcTailwind;
    var buildOpt = {
        entryPoints: [fileInput],
        bundle: true,
        outfile: fileOutJsBrowser,
        sourcemap: false,
        minify: true,
        target: 'es6',
        format: 'iife',
        platform: "browser",
        plugins: [
            vuePlugin({
                postcss: {
                    plugins: [
                        tailwindcss(tailwindConfig),
                        autoprefixer()
                    ]
                }
            }),

            // ini diperlukan untuk css non vue, seperti main.css
            stylePlugin({
                postcss: {
                    plugins: [
                        tailwindcss(tailwindConfig),
                        autoprefixer()
                    ]
                }
            }),
            externalGlobalPlugin({
                "socket.io-client": "window.io",
                ...OpenLayerEsBuildGlobal
            }),

        ],
        loader: {
            '.css': 'css',
            '.ttf': 'file',
            '.otf': 'file',
            '.woff2': 'file',
        },
        define: {
            __BUILD_DATE__: JSON.stringify(new Date().toLocaleString()),
            __ISDEV__: JSON.stringify(false),
            __ISSERVER__: JSON.stringify(false)
        },
        external: [
            "ol"
        ]

    } as any as esbuild.BuildOptions

    return buildOpt;
}

let htmlStr: string = null;
async function writeHtml() {
    await mkdir(folderPublicDst, { recursive: true });
    if (htmlStr == null) {
        let htmlpath = path.join(folderPublicSrc, "index.html");
        htmlStr = await readFile(htmlpath, "utf8");
    }

    let now = Date.now();
    let nHtml = htmlStr.replace(/LELOADFILE/g, "" + now);
    let htmlPath = path.join(folderPublicDst, "index.html");
    await writeFile(htmlPath, nHtml);
}



export async function buildBrowser() {
    console.log("start build browser");

    await writeHtml();
    languageBuild();
    buildIcon();


    let buildOpt = createOption(fileInputJsBrowser);
    await esbuild.build(buildOpt);
    console.log('🌐 Frontend build sukses!');
}

export async function buildBrowserWatch() {
    console.log("\n\nstart build browserwatch");
    let buildOpt = createOption(fileInputJsBrowser);

    buildIconWatch();

    buildOpt.sourcemap = true;
    buildOpt.minify = false;

    let wss = new WebSocketServer({ port: 0 });
    let port = (wss.address() as any).port;
    console.log(`Dev Websocket Port : ${port}`)

    let reloadBrowser = () => {

        wss.clients.forEach((client) => client.send("reload"));
    }

    
    languageBuildWatch(()=>{reloadBrowser();});

    buildOpt.footer = {
        js: `
            // DEV reload Tools
            (() => {
                let log = console.log; 
                log("connecting to ws dev")
                const ws = new WebSocket("ws://localhost:${port}");
                ws.onmessage = (e) => { if (e.data === 'reload') location.reload(); } 
                ws.onopen = () => {
                    log("wsDev connected port : ${port}");
                } 
            })();                   
        `
    };

    wss.on("connection", () => console.log("🔌 Browser connected for reload"));

    buildOpt.plugins.push({
        name: 'rebuild-notify',
        setup(build) {
            build.onEnd(async (result) => {
                console.log("🌐 after build brwoser watch");
                await writeHtml();
                reloadBrowser();
            })
        },
    })

    const ctx = await esbuild.context(buildOpt);
    await ctx.watch();
}


// async function build() {

//     if (process.argv.includes("browser")) {
//         console.log("ini build browser");
//         await buildBrowser();
//         return;
//     }

//     if (process.argv.includes("browserwatch")) {
//         console.log("ini build browserwatch");
//         await buildBrowserWatch();
//         return;
//     }



// }

// build();