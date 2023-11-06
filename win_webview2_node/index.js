
var ffi = require('ffi-napi');

var arc = require('os').arch();
const path = require("path")

let libFilePath = "./bin/Win32/";
if (arc == "x64") {
    console.log("using x64")
    libFilePath = "./bin/x64/";
}

console.log(libFilePath); 
libFilePath = path.join(__dirname, libFilePath);

const mainDllPath =  path.join(libFilePath, "win_webview2_lib.dll");
const webviewDllPath = path.join(libFilePath, "WebView2Loader.dll");

ffi.Library(webviewDllPath);

console.log(libFilePath);

var callback = ffi.Callback('void', ['string'],(g)=>{
    console.log("ini dari c++ " + g);
})

module.exports = {
    openWebview: () => { 
        var libm = ffi.Library(mainDllPath, {
            'OpenWebview': ['int', [ 'string', 'pointer']]
        });

        libm.OpenWebview.async("https://oriindonesia.com", callback,(e,res)=>{
            console.log(e);
            console.log(res);
        })
 

    }
}