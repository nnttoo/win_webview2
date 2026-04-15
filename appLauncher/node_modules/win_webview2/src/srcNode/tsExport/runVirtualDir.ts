import { getModule, Ww2WebConfig } from "./downloadModule";
import { closeSplash } from "./winwebview2";

export interface JsonMsg {
    funName : string,
    data : string,
    replyFun : string,
}

export function runVirtualDir(config : Omit<Ww2WebConfig,"onPostMessage" | "url" | "virtualHostNameToFolderMapping"> & {
    mapFunction : {[key : string] : (msg : string)=>Promise<string>},
    virtualHostNameToFolderMapping : string
}){
    getModule().then((wwv)=>{
        closeSplash();
        wwv.openWeb({
            callback : config.callback,
            height : config.height,
            width : config.width,
            wclassname : config.wclassname,
            isDebug : config.isDebug,
            isKiosk : config.isKiosk,
            isMaximize : config.isMaximize,
            onPostMessage : async (msg,r)=>{
                try {
                    
                    let jobj = JSON.parse(msg) as JsonMsg;
                    if(jobj.funName == null) throw "onPostMessage no funName";

                    let result = await config.mapFunction[jobj.funName](jobj.data); 
                    let replyObj : JsonMsg = {
                        funName :  jobj.funName,
                        data : result,
                        replyFun : jobj.replyFun
                    }
                    r(JSON.stringify(replyObj));

                } catch (error) {
                    
                }

            },
            title : config.title,
            url : "",
            virtualHostNameToFolderMapping : config.virtualHostNameToFolderMapping
        })

    })
} 
 