// @ts-check  
import  express  from 'express';
import path  from 'path'; 
import { Server } from 'http';
import {   controlWindow, openDialogFile, openDialogFolder, openWeb } from "win_webview2"
 
/**
 * 
 * @param {string} address 
 */
function openWebview(address) {
    openWeb({
        height : 400,
        width: 800,
        kiosk : false,
        maximize : false,
        title : "auto",
        url : address, 
        isDebugMode : true,
        winClassName : "openWebApp"
    }) 
}

function openFileDilog() {
    return  openDialogFile({
        winClassName: "openWebApp",
        filter : "Image Files (jpeg)|*.bmp;*.jpg;*.jpeg;*.png;*.gif||"
    }); 
}
function openFileDilogFolder() {
    return openDialogFolder({
        winClassName : "openWebApp"
    });
}
 

/** @type {import("express").Application} */
const app   = express();
const port = 0; // 0 random port
 

/**
 * 
 * @param {number} n 
 * @returns 
 */
function sleep(n) {
    return new Promise((r, x) => {
        setTimeout(() => {
            r(null);
        }, n);
    })
}


let timePing = Date.now();

async function runCheck() {
    console.log("run check");
    while (true) {
        if (Date.now() > timePing + (1000 * 10)) {
            break;
        }

        await sleep(1000);
    }
    console.log("process exit");
    process.exit();
}
runCheck();

app.use(express.static(path.join(__dirname, 'html')))
app.get("/openfiledialog", async (r, x) => {

    let filepath = await openFileDilog();

    x.send(filepath)
})
app.get("/openfolderdialog", async (r, x) => {

    let filepath = await openFileDilogFolder();

    x.send(filepath)
});

app.get("/pingServer", async (r, x) => {

    timePing = Date.now();
    x.send("ok");
})


app.get("/close", async (r, x) => {
    controlWindow({
        winClassName : "openWebApp",
        width : 400,
        height : 400,
        controlcmd : "close",
        left : 0,
        top : 0
    })
    x.send("ok");
});



app.get("/maximize", async (r, x) => {
    controlWindow({
        winClassName : "openWebApp",
        width : 400,
        height : 400,
        controlcmd : "maximize",
        left : 0,
        top : 0
    })
    x.send("ok");
});


app.get("/minimize", async (r, x) => {
    controlWindow({
        winClassName : "openWebApp",
        width : 400,
        height : 400,
        controlcmd : "minimize",
        left : 0,
        top : 0
    })
    x.send("ok");
});


app.get("/move", async (r, x) => {
    controlWindow({
        winClassName : "openWebApp",
        width : 400,
        height : 400,
        controlcmd : "move",
        left : 0,
        top : 0
    })
    x.send("ok");
});


app.get("/resize", async (r, x) => {
    controlWindow({
        winClassName : "openWebApp",
        width : 400,
        height : 400,
        controlcmd : "resize",
        left : 0,
        top : 0
    })
    x.send("ok");
});

/** @type {Server} */
let server ;



server = app.listen(port, () => {
    // @ts-ignore
    let rport = server.address().port;
    console.log(`http://localhost:${rport}`) 
    openWebview("http://localhost:" + rport);
})