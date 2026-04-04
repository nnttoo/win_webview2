
import { getModule, ww2_CreateServer } from "win_webview2/node"

ww2_CreateServer({
    port : 0,
    uiConfig: {
        height  : 400,
        wclassname : "myuiclass",
        isDebug : false,
        isKiosk : false,
        isMaximize : false,
        title : "Ww2 UI",
        width : 800
    },
    onExpressCreate : (app)=>{
        
    }
});

