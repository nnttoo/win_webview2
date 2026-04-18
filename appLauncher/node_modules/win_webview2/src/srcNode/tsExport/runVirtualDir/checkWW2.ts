import { Ww2Module } from "../downloadModule";
import { PostData } from "../ww2_server";
import { byteArrayFromString, byteArrayToString, InternalFunctionResult, InternalFunctionResultPromise } from "./util";

export async function checkWw2BrowserFunction(
    arg: {
        path: string,
        method: string,
        body: Uint8Array,
        ww2Module: Ww2Module,
    }): InternalFunctionResultPromise {

    if (arg.path != "/ww2_post") return null;
    if (arg.method != "POST") return null;
    if (arg.body == null) return null;

    let result: InternalFunctionResult | null = null; 

    try {
        let resultText = "";

        let bodyString = byteArrayToString(arg.body);
        let body = JSON.parse(bodyString) as PostData;
        let ww2Module = arg.ww2Module;


        if (body.openWeb) {
            let openWebArg = body.openWeb;
            ww2Module.openWeb({
                onClose: () => {

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

            resultText = "open web";

        } else if (body.controlWindow) {
            ww2Module.controlWindow(body.controlWindow);
            resultText = "controlWindow";

        } else if (body.openFileDialog) {
            let openFileDialogArg = body.openFileDialog;
            resultText = await new Promise((r, x) => {
                ww2Module.openFileDialog({
                    callback: (err, d) => {
                        r(d);
                    },
                    filter: openFileDialogArg.filter,
                    ownerClassName: openFileDialogArg.ownerClassName
                })
            });


        } else if (body.openFolderDialog) {

            let ofArg = body.openFolderDialog;
            resultText = await new Promise((r, x) => {
                ww2Module.openFolderDialog({
                    callback: (err, data) => {
                        r(data);
                    },
                    filter: ofArg.filter,
                    ownerClassName: ofArg.ownerClassName
                });
            });

        }


        let jsonStrResponse = JSON.stringify({
            error : null,
            result : resultText
        });

        result = {
            content : byteArrayFromString(jsonStrResponse),
            contentType : "application/json"
        };

    } catch (error) {
    }




    return result;
}