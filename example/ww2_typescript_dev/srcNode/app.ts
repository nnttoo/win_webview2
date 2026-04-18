
import { existsSync } from "node:fs";
import path from "node:path";
import { closeSplash, getModule, runVirtualDir, ww2_CreateServer } from "win_webview2/node"

let htmlFolder = (() => {
    let result = path.join(__dirname, "html");
    if (!existsSync(result)) {
        result = path.join(process.cwd(), "assets/lib/html")
    }

    console.log(result);
    return result;

})();

runVirtualDir({
    onClose: (err, d) => {

    },
    height: 400,
    wclassname: "myuiclass",
    isDebug: true,
    isKiosk: false,
    isMaximize: false,
    title: "Ww2 UI",
    width: 800,
    mapFunction : {
        getTest : async (msg)=>{
            console.log(msg);
            return {data : "ini test dulu yaaaa : " };
        }
    },
    htmlFolderPath : htmlFolder
})

// ww2_CreateServer({
//     port: 0,
//     uiConfig: {
//         height: 400,
//         wclassname: "myuiclass",
//         isDebug: true,
//         isKiosk: false,
//         isMaximize: false,
//         title: "Ww2 UI",
//         width: 800,
//     },
//     onExpressCreate: (app) => {

//     },
//     htmlfolder: htmlFolder
// });
