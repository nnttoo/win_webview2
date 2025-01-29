import { openWeb } from "./winWebview2.mjs";

//@ts-check
function sleep(n){
    return new Promise((r,x)=>{
        setTimeout(r, n);
    })
}


async function setTest(){
    var itung = 0;

    openWeb({
        url : "https://google.com",
        title : "Judul Website",
        height: 500,
        width : 600,
        maximize : false,
        kiosk : false,
        wndClassName : "MyWeb" 
    })

    while(true){
        await sleep(1000);
        console.log("ini test aja ya 😊");
         
    }
 
    

     
}

// @ts-ignore
process.stdin.on('data', (data) => {
    console.log(`LOGReceived from C++: ${data.toString()}`); 
});
 

setTest();