import { getModule, Ww2WebConfig } from "../downloadModule";
import { closeSplash } from "../winwebview2";
import { byteArrayFromString } from "./util";
import { checkFileFromVirtualFolder } from "./checkFile";
import { checkWw2BrowserFunction } from "./checkWW2"; 
import { checkMapFunction } from "./checkMapFunction";



export function runVirtualDir(config: Omit<Ww2WebConfig, "onVirtualHostRequested" | "url" | "virtualHostName"> & {
    mapFunction: { [key: string]: (msg: object) => Promise<object> },
    htmlFolderPath: string
}) {
    getModule().then((wwvModule) => {
        closeSplash();
        let hostname = "https://myapp.local";
        let wwvConfig: Ww2WebConfig = {
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
                    if (cleanPath == "/" || cleanPath == "") cleanPath = "index.html";

                    console.log(cleanPath);

                    let serverResponse = await checkFileFromVirtualFolder(config.htmlFolderPath, cleanPath);
                    if(serverResponse == null){

                        serverResponse = await checkWw2BrowserFunction({
                            body : req.body,
                            method : req.method,
                            path : cleanPath,
                            ww2Module : wwvModule
                        });
                    }   

                    if(serverResponse == null){
                        serverResponse = await checkMapFunction({
                            body : req.body,
                            mapfunction : config.mapFunction,
                            method : req.method,
                            path : cleanPath
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
                        body: byteArrayFromString("no response"),
                        contentType: "text/plain",
                        status: 404
                    })

                } catch (error) {

                }

            },
            title: config.title,
        };

        wwvModule.openWeb(wwvConfig);

    })
}
