// @ts-check
import { openDialogFile, openDialogFolder, openWeb } from 'win_webview2';
import { fileURLToPath } from 'url';
import  express  from 'express';
import path  from 'path'; 
import { Server } from 'http';
import net from "net"

function sleep(n = 1000){
    return new Promise((r,x)=>{
        setTimeout(r,n);
    })
}


 
 
function openWebview(address) {
    openWeb({
        height : 400,
        width: 800,
        kiosk : false,
        maximize : false,
        title : "auto",
        url : address, 
        isDebugMode : false
    }) 
}

function openFileDilog() {
    return  openDialogFile({
        filter : "Image Files (jpeg)|*.bmp;*.jpg;*.jpeg;*.png;*.gif||"
    }); 
}
function openFileDilogFolder() {
    return openDialogFolder();
}
 

/** @type {import("express").Application} */
const app   = express();
const port = 0; // 0 random port

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'html')))
app.get("/openfiledialog", async (r, x) => {

    let filepath = await openFileDilog();

    x.send(filepath)
})
app.get("/openfolderdialog", async (r, x) => {

    let filepath = await openFileDilogFolder();

    x.send(filepath)
})

/** @type {Server} */
let server ;



server = app.listen(port, () => {
    // @ts-ignore
    let rport = server.address().port;
    console.log(`http://localhost:${rport}`) 
    openWebview("http://localhost:" + rport);
})