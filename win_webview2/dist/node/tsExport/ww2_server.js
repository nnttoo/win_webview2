"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ww2_CreateServer = ww2_CreateServer;
const express_1 = __importDefault(require("express"));
const winwebview2_1 = require("./winwebview2");
async function ww2_CreateServer(arg) {
    let port = arg.port ? arg.port : 0;
    let app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.static(arg.htmlfolder));
    arg.onExpressCreate(app);
    app.post("/ww2_post", async (req, res) => {
        let body = req.body;
        console.log("ww2_post", body);
        let result = "";
        let err = "";
        try {
            if (body.openWeb) {
                let openWebArg = body.openWeb;
                ww2Module.openWeb({
                    callback: () => {
                    },
                    height: openWebArg.height,
                    wclassname: openWebArg.wclassname,
                    isDebug: openWebArg.isDebug,
                    isKiosk: openWebArg.isKiosk,
                    isMaximize: openWebArg.isMaximize,
                    title: openWebArg.title,
                    url: openWebArg.url,
                    width: openWebArg.width
                });
                result = openWebArg.url;
            }
            else if (body.controlWindow) {
                ww2Module.controlWindow(body.controlWindow);
            }
            else if (body.openFileDialog) {
                let openFileDialogArg = body.openFileDialog;
                result = await new Promise((r, x) => {
                    ww2Module.openFileDialog({
                        callback: (err, d) => {
                            r(d);
                        },
                        filter: openFileDialogArg.filter,
                        ownerClassName: openFileDialogArg.ownerClassName
                    });
                });
            }
            else if (body.openFolderDialog) {
                let ofArg = body.openFolderDialog;
                result = await new Promise((r, x) => {
                    ww2Module.openFolderDialog({
                        callback: (err, data) => {
                            r(data);
                        },
                        filter: ofArg.filter,
                        ownerClassName: ofArg.ownerClassName
                    });
                });
            }
        }
        catch (error) {
            err = error + "";
        }
        res.json({
            error: err,
            result: result
        });
    });
    let ww2Module = await (0, winwebview2_1.getModule)();
    let server = app.listen(port, async (err) => {
        let add = server.address();
        if (add == null) {
            console.log("build server failed : " + err);
            process.exit();
        }
        let addr = add;
        let resultPort = addr.port;
        let url = `http://localhost:${resultPort}`;
        console.log(url);
        console.log("open UI");
        let uiConfig = arg.uiConfig;
        ww2Module.openWeb({
            callback: (err, data) => {
                process.exit();
            },
            wclassname: uiConfig.wclassname,
            height: uiConfig.height,
            isDebug: uiConfig.isDebug,
            isKiosk: uiConfig.isKiosk,
            isMaximize: uiConfig.isMaximize,
            title: uiConfig.title,
            width: uiConfig.width,
            url: url,
        });
    });
}
