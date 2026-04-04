
import express from 'express';
import path from 'path';
import { Server } from 'http';
import { AddressInfo } from 'net';
import { getModule, WW2ControlWindowsArg } from './winwebview2';

interface WW2FileDialogArg {
    filter: string;
    ownerClassName: string;
}


export type PostData = {
    openWeb?: {
        wclassname: string,
        url: string,
        title: string,

        width: number,
        height: number,
        isKiosk: boolean,
        isMaximize: boolean,
        isDebug: boolean,
    },
    openFileDialog?: WW2FileDialogArg,
    openFolderDialog?: WW2FileDialogArg,
    controlWindow?: WW2ControlWindowsArg,
}

export async function ww2_CreateServer(arg: {
    port: number,
    onExpressCreate: (app: express.Express) => void,
    uiConfig: {

        wclassname: string,
        title: string,
        width: number,
        height: number,
        isKiosk: boolean,
        isMaximize: boolean,
        isDebug: boolean,
    }
}) {
    let port = arg.port ? arg.port : 0;

    let app = express();
    app.use(express.static('./assets/html'));
    arg.onExpressCreate(app);

    app.post("/ww2_post", async (req, res) => {

        let body = req.body as PostData;

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

            } else if (body.controlWindow) {
                ww2Module.controlWindow(body.controlWindow);
            } else if (body.openFileDialog) {
                let openFileDialogArg = body.openFileDialog;
                result = await new Promise((r, x) => {
                    ww2Module.openFileDialog({
                        callback: (err, d) => {
                            r(d);
                        },
                        filter: openFileDialogArg.filter,
                        ownerClassName: openFileDialogArg.ownerClassName
                    })
                });
            } else if(body.openFolderDialog){

                let ofArg = body.openFolderDialog;
                result = await new Promise((r,x)=>{
                    ww2Module.openFolderDialog({
                        callback : (err,data)=>{
                            r(data);
                        },
                        filter : ofArg.filter,
                        ownerClassName : ofArg.ownerClassName
                    });
                });

            }
        } catch (error) {
            err = error + "";
        }

        res.json({
            error : err,
            result : result
        });

    });

    let ww2Module = await getModule();

    let server = app.listen(port, async (err) => {
        let add = server.address();
        if (add == null) {
            console.log("build server failed : " + err);
            process.exit();
        }

        let addr = add as AddressInfo;

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

        })

    })


}