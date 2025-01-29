// @ts-check
let isOncloseSetted = false;
const prefixWebview = "WINWEBVIEW_";
const prefixWebviewResult = "WIN_WEBVIEW2_RESULT";

/** @type {string | null} */
let resultDataFromWebview2 = "";
let resultInUse = false;


/**
 * 
 * @param {number} n 
 */
function sleep(n){
   return new Promise((r,x)=>{
      setTimeout(r,n);
   })
}


/**
 * 
 * @param {object } arg 
 */
async function waitingResult(arg){
   if(resultInUse ) return "";
   resultInUse = true; 
   
   resultDataFromWebview2 = null; 
   
   var objstr = JSON.stringify(arg);
   console.log(`${prefixWebview}JSON` + objstr);

   while(resultDataFromWebview2 == null){
      await sleep(200);
   }

   resultInUse = false;
   return resultDataFromWebview2;

}


/**
 * 
 * @param {string} data 
 */
function setToResult(data){
   if(!data.startsWith(prefixWebviewResult)) return false;
   let result = data.substring(prefixWebviewResult.length);
   resultDataFromWebview2 = result; 
   return true;
}

function setOnClosed() {
   process.stdin.on("data", (dataIn) => {
      let data = dataIn.toString();
      if(setToResult(data)) return;

      console.log(data);
      if (data == `${prefixWebview}MAINPAGEISCLOSED`) {
         console.log("server diclose");
         process.exit();
      }
   })
}


/**
* 
* @param {import("./argtype").OpenWebArg } arg 
*/
export function openWeb(arg) {
   if(!isOncloseSetted){
      isOncloseSetted = true;
      setOnClosed();
   }

   arg["fun"] = "OpenWeb";
   var objstr = JSON.stringify(arg);
   console.log(`${prefixWebview}JSON` + objstr);
}

/**
 * 
 * @param {import("./argtype").OpenDialogFileArg} arg 
 * @returns {Promise<string>}
 */
export  function openDialogFile(arg){
   arg["fun"] = "OpenDialogFIle";
   return waitingResult(arg); 
}

export async function openDialogFolder(){
   let obj = {
      fun : "OpenDialogFolder"
   };
   return waitingResult(obj);  
}