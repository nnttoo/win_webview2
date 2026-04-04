import path from "node:path";

interface Ww2WebConfig{
    callback : (err : any, data : any)=>void;
    wclassname : string;
    url : string;
    title : string;

    width : number;
    height : number;
    isKiosk : boolean;
    isMaximize : boolean;
    isDebug : boolean;

}

interface Ww2Module{
    openWeb :(arg : Ww2WebConfig)=>void;
}


(() => {
    let filepath = path.join(
        __dirname,
        "../../nodeAddOn/build/Release/ww2_addon.node"
    );

    const myAddon = require(filepath) as Ww2Module;
    myAddon.openWeb(
        {
            wclassname: "myClassName",
            callback: (r: any, data: any) => {

                console.log(data);

            },
            width : 700,
            height : 500,
            isDebug : false,
            isKiosk : false,
            isMaximize : false,
            title : "Test Title",
            url : "https://harycodeworks.com"
        }  
    );
    console.log("tst ini kebuka");

})();