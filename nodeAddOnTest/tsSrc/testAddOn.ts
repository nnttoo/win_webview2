import path from "node:path";

interface Ww2WebConfig {
    callback: (err: any, data: any) => void;
    wclassname: string;
    url: string;
    title: string;

    width: number;
    height: number;
    isKiosk: boolean;
    isMaximize: boolean;
    isDebug: boolean;

}

interface WW2FileDialogArg {
    callback: (err: any, data: any) => void;
    filter :  string;
    ownerClassName : string;
}

interface Ww2Module {
    openWeb: (arg: Ww2WebConfig) => void;
    openFileDialog: (arg: WW2FileDialogArg) => void;
    openFolderDialog :(arg: WW2FileDialogArg) => void;
}
let filepath = path.join(
    __dirname,
    "../../nodeAddOn/build/x64/Release/ww2_addon.node"
);

const myAddon = require(filepath) as Ww2Module;

let testWebView = () => {

    myAddon.openWeb(
        {
            wclassname: "myClassName",
            callback: (r: any, data: any) => {

                console.log(data);

            },
            width: 700,
            height: 500,
            isDebug: false,
            isKiosk: false,
            isMaximize: false,
            title: "Test Title",
            url: "https://harycodeworks.com"
        }
    );
    console.log("tst ini kebuka");

};
let testFileDialog = () => {

     myAddon.openFileDialog({
        filter : ".png",
        ownerClassName : "",
        callback : (err,data)=>{
            console.log(data);
        }
     }); 
}

 function testFolderDialog(){
    return myAddon.openFolderDialog({
        filter : "",
        ownerClassName : "",
        
        callback : (err,data)=>{
            console.log(data);
        }
    });

}

(async () => {


    var result = testFolderDialog();
    console.log(result);
})();

