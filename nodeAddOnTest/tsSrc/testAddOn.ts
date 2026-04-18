import path from "node:path";

interface ResourceRequest {
    uri: string,
    method: string,
    body: Uint8Array
}

interface ResourceResponse {
    status: number,
    contentType: string,
    body: Uint8Array
}

interface Ww2WebConfig {
    onClose: (err: any, data: any) => void;
    wclassname: string;
    url: string;
    title: string;

    width: number;
    height: number;
    isKiosk: boolean;
    isMaximize: boolean;
    isDebug: boolean;
    virtualHostName?: string,
    onVirtualHostRequested?: (req: ResourceRequest, reply: (res: ResourceResponse) => void) => void
}

interface WW2FileDialogArg {
    callback: (err: any, data: any) => void;
    filter: string;
    ownerClassName: string;
}

interface WW2ControlWindowsArg {
    wndClassName: string;
    controlcmd: "close" | "move" | "maximize" | "minimize" | "resize" | "check",
    left?: number;
    top?: number;
    height?: number;
    width?: number;
}

interface Ww2Module {
    openWeb: (arg: Ww2WebConfig) => void;
    openFileDialog: (arg: WW2FileDialogArg) => void;
    openFolderDialog: (arg: WW2FileDialogArg) => void;
    controlWindow: (arg: WW2ControlWindowsArg) => void;
}

let filepath = path.join(
    __dirname,
    "../../nodeAddOn/build/x64/Release/ww2_addon.node"
);

const myAddon = require(filepath) as Ww2Module;

let oldReply: ((msg: string) => void) | null = null;

let testWebView = () => {

    myAddon.openWeb(
        {
            wclassname: "myClassName",
            onClose: (r: any, data: any) => {

                console.log(data);

            },
            width: 700,
            height: 500,
            isDebug: true,
            isKiosk: false,
            isMaximize: false,
            title: "Test Title",
            url: "https://myapp.local",
            virtualHostName: "https://myapp.local",
            onVirtualHostRequested: (res, rply) => {
                console.log(res.method);
                console.log(res.uri);

                const text = "<b>Halo dari win_webview2!<b>";
                const encoder = new TextEncoder();
                const uint8Array = encoder.encode(text);

                rply({
                    body : uint8Array,
                    contentType : "text/plain",
                    status : 200,
                })
            }
        }
    );
    console.log("tst ini kebuka");

};
let testFileDialog = () => {

    myAddon.openFileDialog({
        filter: ".png",
        ownerClassName: "",
        callback: (err, data) => {
            console.log(data);
        }
    });
}

function testFolderDialog() {
    return myAddon.openFolderDialog({
        filter: "",
        ownerClassName: "",

        callback: (err, data) => {
            console.log(data);
        }
    });

}

function controlWindow() {
    var r = myAddon.controlWindow({
        wndClassName: "myClassName",
        controlcmd: "minimize"
    });

    console.log(r);
}

function sleep(n: number) {
    return new Promise((r, x) => {
        setTimeout(() => {
            r(null);
        }, n);
    })
}

(async () => {
    testWebView();
    console.log("waiting");
    await sleep(2000);
    console.log("control windows");
    //controlWindow();
})();

