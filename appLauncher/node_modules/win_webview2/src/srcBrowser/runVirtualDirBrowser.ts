 
let registerListenerReady = false;

let funRegistred: { [key: string]: (data: string) => void } = {}

interface JsonMsg {
    funName: string,
    data: string,
    replyFun: string,
}

function registerListener() {
    if (registerListenerReady) return;

    // @ts-ignore
    window.chrome.webview.addEventListener('message', function (event) {
        let data = event.data;
        try {

            let jobj = JSON.parse(data) as JsonMsg;
            funRegistred[jobj.replyFun](jobj.data);

        } catch (error) {
            console.log("messageError ", error);
        }
    });

    registerListenerReady = true;

}

export function callVirtualDirFunction(funName: string, param : string) {
    let ranNumber = Date.now();
    let replyFun = funName + ranNumber;
    registerListener();

    let jsonPost : JsonMsg = {
        funName : funName,
        data : param,
        replyFun : replyFun
    };

    // @ts-ignore
    window.chrome.webview.postMessage(JSON.stringify(jsonPost));

    return new Promise((r, x) => {
        funRegistred[replyFun] = (msg) => { 
            delete funRegistred[replyFun];
            r(msg);
        }

    }); 
}