let registerListenerReady = false;
let funRegistred = {};
function registerListener() {
    if (registerListenerReady)
        return;
    // @ts-ignore
    window.chrome.webview.addEventListener('message', function (event) {
        let data = event.data;
        try {
            let jobj = JSON.parse(data);
            funRegistred[jobj.replyFun](jobj.data);
        }
        catch (error) {
            console.log("messageError ", error);
        }
    });
    registerListenerReady = true;
}
export function callVirtualDirFunction(funName, param) {
    let ranNumber = Date.now();
    let replyFun = funName + ranNumber;
    registerListener();
    let jsonPost = {
        funName: funName,
        data: param,
        replyFun: replyFun
    };
    // @ts-ignore
    window.chrome.webview.postMessage(JSON.stringify(jsonPost));
    return new Promise((r, x) => {
        funRegistred[replyFun] = (msg) => {
            delete funRegistred[replyFun];
            r(msg);
        };
    });
}
