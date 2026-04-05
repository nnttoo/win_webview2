//@ts-check

const ww2 = require("win_webview2/node");
const path = require("path");
const { existsSync } = require("fs");



let htmlFolder = (() => {
    let result = path.join(__dirname, "html");
    if (!existsSync(result)) {
        result = path.join(process.cwd(), "assets/lib/html")
    }

    console.log(result);
    return result;

})();

(async () => {

    let ww2Config = await ww2.readConfig();
    if(ww2Config == null) throw "config is null";

    ww2.ww2_CreateServer({
        htmlfolder: htmlFolder,
        onExpressCreate: (app) => {

        },
        port: 0,
        uiConfig: {
            height: 600,
            isDebug: true,
            isKiosk: false,
            isMaximize: false,
            title: ww2Config.appname,
            wclassname: "mytsvanilla",
            width: 800
        }
    })

    ww2.closeSplash();
})();

