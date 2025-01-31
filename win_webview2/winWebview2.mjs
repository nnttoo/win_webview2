// @ts-check

import net from "net"
let isOncloseSetted = false;
const prefixWebview = "WINWEBVIEW_";
const prefixWebviewResult = "WIN_WEBVIEW2_RESULT";

/** @type {string | null} */
let resultDataFromWebview2 = "";
let resultInUse = false;

function sleep(n = 1000) {
    return new Promise((r, x) => {
        setTimeout(r, n);
    })
}


/**
 * 
 * @param {object } arg 
 */
async function waitingResult(arg) {
    if (resultInUse) return "";
    resultInUse = true;

    resultDataFromWebview2 = null;

    var objstr = JSON.stringify(arg);
    sendToPipe(`${prefixWebview}JSON` + objstr);

    while (resultDataFromWebview2 == null) {
        await sleep(200);
    }

    resultInUse = false;
    return resultDataFromWebview2;

}

 
  
async function createPipe() {

    // ini akan terhubung terus menerus

    /** @type {string} */
    // @ts-ignore
    let PIPE_CPLUS_SENDER = process.env.PIPE_PATH + "Sender"; 


    let client  = net.createConnection(PIPE_CPLUS_SENDER, () => {
        console.log('Anak terhubung ke Named Pipe!');
    });

    client.on('data', (buff) => {
        let data = buff.toString(); 

        if (!data.startsWith(prefixWebviewResult)) return false;
        let result = data.substring(prefixWebviewResult.length);
        resultDataFromWebview2 = result;
    }); 

    // while(true){
    //     await sleep();
    //     sendToPipe("ping");
    // }
}

/** 
 * @param {string} msg  
 */
function sendToPipe(msg) {

    /** @type {any} */
    var PIPE_CPLUS_Reader = process.env.PIPE_PATH; 
    let client  = net.createConnection(PIPE_CPLUS_Reader, () => {
        console.log("PIPE_CPLUS_Reader terhubung")
        client.write(msg);
    });
    client.on("error",(e)=>{
        console.log("errornya apa  : ", e );
    })
}

/**
* 
* @param {import("./argtype").OpenWebArg } arg 
*/
export function openWeb(arg) {
    if (!isOncloseSetted) {
        isOncloseSetted = true;
        createPipe();
    }

    arg["fun"] = "OpenWeb";
    var objstr = JSON.stringify(arg);
    sendToPipe(`${prefixWebview}JSON` + objstr);
}

/**
 * 
 * @param {import("./argtype").OpenDialogFileArg} arg 
 * @returns {Promise<string>}
 */
export function openDialogFile(arg) {
    arg["fun"] = "OpenDialogFIle";
    return waitingResult(arg);
}

export async function openDialogFolder() {
    let obj = {
        fun: "OpenDialogFolder"
    };
    return waitingResult(obj);
}