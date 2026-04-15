"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runVirtualDir = runVirtualDir;
const downloadModule_1 = require("./downloadModule");
const winwebview2_1 = require("./winwebview2");
function runVirtualDir(config) {
    (0, downloadModule_1.getModule)().then((wwv) => {
        (0, winwebview2_1.closeSplash)();
        wwv.openWeb({
            callback: config.callback,
            height: config.height,
            width: config.width,
            wclassname: config.wclassname,
            isDebug: config.isDebug,
            isKiosk: config.isKiosk,
            isMaximize: config.isMaximize,
            onPostMessage: async (msg, r) => {
                try {
                    let jobj = JSON.parse(msg);
                    if (jobj.funName == null)
                        throw "onPostMessage no funName";
                    let result = await config.mapFunction[jobj.funName](jobj.data);
                    let replyObj = {
                        funName: jobj.funName,
                        data: result,
                        replyFun: jobj.replyFun
                    };
                    r(JSON.stringify(replyObj));
                }
                catch (error) {
                }
            },
            title: config.title,
            url: "",
            virtualHostNameToFolderMapping: config.virtualHostNameToFolderMapping
        });
    });
}
