
const win_webview2_node = require("win_webview2_node");

(async ()=>{
    await win_webview2_node.openWebview({
        callback : (str)=>{
    
        },
        height : 700,
        width : 900,
        kiosk : false,
        maximize : false,
        title : "Ini title windows",
        url : "file:///E:/ProjectMULTI_P/CMDWebview/win_webview2/gitfolder/example/openweb/index.html",
        windowclassname : "mainwindowsname",
        windowParentclassname : "",
        ffiCallback : win_webview2_node.createFFIcallback((g)=>{
            console.log("inilah hasil dariiiiii " + g);
        })
    });

    console.log("ini sudah berakhir");
})();



 