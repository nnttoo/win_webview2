"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runVirtualDir = runVirtualDir;
const downloadModule_1 = require("../downloadModule");
const winwebview2_1 = require("../winwebview2");
const util_1 = require("./util");
const checkFile_1 = require("./checkFile");
const checkWW2_1 = require("./checkWW2");
const checkMapFunction_1 = require("./checkMapFunction");
function runVirtualDir(config) {
    (0, downloadModule_1.getModule)().then((wwvModule) => {
        (0, winwebview2_1.closeSplash)();
        let hostname = "https://myapp.local";
        let wwvConfig = {
            onClose: config.onClose,
            height: config.height,
            width: config.width,
            wclassname: config.wclassname,
            isDebug: config.isDebug,
            isKiosk: config.isKiosk,
            isMaximize: config.isMaximize,
            virtualHostName: hostname,
            url: hostname,
            onVirtualHostRequested: async (req, response) => {
                try {
                    let parsedUrl = new URL(req.uri, hostname);
                    let cleanPath = parsedUrl.pathname;
                    if (cleanPath == "/" || cleanPath == "")
                        cleanPath = "index.html";
                    console.log(cleanPath);
                    let serverResponse = await (0, checkFile_1.checkFileFromVirtualFolder)(config.htmlFolderPath, cleanPath);
                    if (serverResponse == null) {
                        serverResponse = await (0, checkWW2_1.checkWw2BrowserFunction)({
                            body: req.body,
                            method: req.method,
                            path: cleanPath,
                            ww2Module: wwvModule
                        });
                    }
                    if (serverResponse == null) {
                        serverResponse = await (0, checkMapFunction_1.checkMapFunction)({
                            body: req.body,
                            mapfunction: config.mapFunction,
                            method: req.method,
                            path: cleanPath
                        });
                    }
                    if (serverResponse != null) {
                        response({
                            body: serverResponse.content,
                            contentType: serverResponse.contentType,
                            status: 200
                        });
                        return;
                    }
                    response({
                        body: (0, util_1.byteArrayFromString)("no response"),
                        contentType: "text/plain",
                        status: 404
                    });
                }
                catch (error) {
                }
            },
            title: config.title,
        };
        wwvModule.openWeb(wwvConfig);
    });
}
