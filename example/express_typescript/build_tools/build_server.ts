import * as esbuild from 'esbuild'
import { BuildConfig } from './build__config';
import path from 'path';


function getESBUildOption(): esbuild.BuildOptions {
    return {
        entryPoints: [path.join(BuildConfig.srcServer, "server.ts")],
        bundle: true,
        outfile: path.join(BuildConfig.distNodeApp, "app.js"),
        platform: 'node',  // Agar sesuai dengan Node.js
        sourcemap: false,
        target: 'es6',
        minify: true,
        format: 'cjs',      // Gunakan CommonJS agar kompatibel dengan Node.js
        external: ['express', "mongodb", "mongoose", "dotenv",
            "redis",
            "jsonwebtoken",
            "cookie-parser",
            "socket.io",
            "ws",
            "mssql",
            "@socket.io/cluster-adapter",
            "@socket.io/sticky"
        ], // Hindari bundling express (gunakan dari node_modules),
        define: {
            __BUILD_DATE__: JSON.stringify(new Date().toLocaleString()),
            __ISDEV__: JSON.stringify(false),
            __ISSERVER__: JSON.stringify(true)
        },
        plugins : []
    }
}

export async function buildServer() {
    let buildOption = getESBUildOption();
    await esbuild.build(buildOption);

    console.log('🖥️ Backend build sukses!');
}


export async function buildServerWatch() {
    console.log("\n\nStart Server Build Watch");
    let buildOption = getESBUildOption();
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