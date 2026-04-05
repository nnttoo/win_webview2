import * as esbuild from 'esbuild' 
import path from 'node:path'; 
import { findUserProjectRoot } from "win_webview2/node"
import { WebSocketServer } from "ws";
   

async function createOption( ) {
    let projectPath = findUserProjectRoot();
    if(projectPath == null) projectPath = "./"
    
    var buildOpt = { 
            entryPoints: ['srcBrowser/app_browser.ts'],
            bundle: true,
            minify: false,
            sourcemap: true,
            format: 'iife',
            target: 'es6',
            outfile: await (async ()=>{
                let outFile = path.join(projectPath,"assets/lib/html/app_browser.js");
                try {
                    //await mkdir(path.dirname(outFile),{recursive : true});
                } catch (error) {
                    
                }
                return outFile; 
            })(),
            platform: 'browser',
            define: {
                'process.env.NODE_ENV': '"production"',
            }, 
        } as any as esbuild.BuildOptions

    return buildOpt;
}
 

export async function buildBrowser() {
    console.log("start build browser"); 


    let buildOpt = await createOption();
    await esbuild.build(buildOpt);
    console.log('🌐 Frontend build sukses!');
}
 

export async function buildBrowserWatch() {
    console.log("\n\nstart build browserwatch");
    let buildOpt = await createOption(); 

    buildOpt.sourcemap = true;
    buildOpt.minify = false;

    let wss = new WebSocketServer({ port: 0 });
    let port = (wss.address() as any).port;
    console.log(`Dev Websocket Port : ${port}`)

    let reloadBrowser = () => {

        wss.clients.forEach((client) => client.send("reload"));
    } 

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

    let plugins : esbuild.Plugin[] = [];

    if(buildOpt.plugins  ){
        plugins= buildOpt.plugins;
    } else {
        buildOpt.plugins = plugins;
    }

    plugins.push({
        name: 'rebuild-notify',
        setup(build) {
            build.onEnd(async (result) => {
                console.log("🌐 after build brwoser watch"); 
                reloadBrowser();
            })
        },
    })

    const ctx = await esbuild.context(buildOpt);
    await ctx.watch();
}


async function build() {
 

    if (process.argv.includes("--watch")) {
        console.log("ini build browserwatch");
        await buildBrowserWatch();
        return;
    } else {
        await buildBrowser();
    }



}

build();