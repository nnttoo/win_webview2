 
import esbuild from "esbuild"
import fs from "fs-extra" 

async function copyHtml(){
    let fromHtml = "./html";
    let toHtml = "./dist/html"
    fs.copy(fromHtml, toHtml);
}

esbuild.build({
    entryPoints: ["index.js"],
    bundle: true,
    outfile: "./dist/app.js",
    minify: true,
    platform: "node",
    plugins: []
});
copyHtml();