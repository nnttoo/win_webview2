
var ffi = require('ffi-napi');

var arc = require('os').arch();
const path = require("path")

let libFilePath = "./bin/Win32/";
if (arc == "x64") {
    console.log("using x64")
    libFilePath = "./bin/x64/";
}

libFilePath = path.join(__dirname, libFilePath);

const mainDllPath = path.join(libFilePath, "win_webview2_lib.dll");
const webviewDllPath = path.join(libFilePath, "WebView2Loader.dll");

ffi.Library(webviewDllPath);



 
module.exports = {

   

    // void OpenWebview(
    //     const char* url,
    //     int width,
    //     int height,
    //     bool maximize,
    //     bool kiosk,
    //     const char* title,
    //     const char* windowclassname,
    //     const char* windowParentclassname,
    //     CallbackType cb

    // ) 

    /**
     * @typedef OpenWebviewProp
     * @property {string} url
     * @property {int} width
     * @property {int} height
     * @property {bool} maximize
     * @property {bool} kiosk
     * @property {string} title
     * @property {string} windowclassname
     * @property {string} windowParentclassname
     * @property {SimpleFFIcallback} ffiCallback
     * @property {(string : str)=>void} callback
     * 
     * @param {OpenWebviewProp} prop 
     */
    openWebview: (prop) => {
        var libm = ffi.Library(mainDllPath, {
            'OpenWebview': ['void',
                [
                    'string', //url 
                    'int', //width 
                    'int', // height
                    'bool', // maximize
                    'bool', // kiosk
                    'string', // title.
                    'string', // windowclassname
                    'string', // windowParentclassname
                    'pointer', // CallbackType
                ]]
        });

        return new Promise((r,x)=>{
            libm.OpenWebview.async(
                prop.url,
                prop.width,
                prop.height,
                prop.maximize,
                prop.kiosk,
                prop.title,
                prop.windowclassname,
                prop.windowParentclassname,
    
                prop.ffiCallback, 
                (e, res) => {
                    if(e){
                        x(e);
                    } else {
                        r(res);
                    }
                }
    
            )
        })

        


    }
}