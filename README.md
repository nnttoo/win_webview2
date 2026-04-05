 
## win_webview2 

A lightweight Node.js module to build Windows desktop UIs using Microsoft WebView2. A minimal and tiny alternative to Electron for developers who need a simple web-based interface without the heavy Chromium overhead 
 


## Installation
Install the package via npm:


```sh
npm install win_webview2
```
 

## Installation & CLI Tool  
The win_webview2 CLI is your all-in-one tool for managing your project.
## 1. Scaffolding (First time)  

To download the example project and set up your boilerplate, run:

```sh

npx win_webview2
```


## 2. Development & Build (After setup)

Once the project is downloaded, you can run the same command again inside your project folder:

```sh

npx win_webview2
```


What it does:
It will trigger an interactive prompt selector, allowing you to choose common tasks such as:

* Run Development/Watch Mode: To see changes in real-time.
* Build Project: To compile your application for distribution.
* And more: Any other project-specific scripts configured in the CLI.

Instead of memorizing different scripts, you only need to remember one command. Our interactive CLI will guide you through building, running, and managing your WebView2 UI.
 
 

## Features

* Built-in Express Server: Easily serve your static HTML folders.
* Native UI Management: Control window states (maximize, minimize, move, resize).
* Native Dialogs: Access Windows Open File and Open Folder dialogs directly from the browser.
* Low-level API: Direct access to the native Node.js addon.
 


## Basic Usage (Server-side)

Use ww2_CreateServer to host your HTML files and initialize the WebView2 window.

```ts

import { existsSync } from "node:fs";
import path from "node:path";
import { closeSplash, ww2_CreateServer } from "win_webview2/node"
// Determine your HTML folder path

let htmlFolder = (() => {
    let result = path.join(__dirname, "html");
    if (!existsSync(result)) {
        result = path.join(process.cwd(), "assets/lib/html")
    }
    return result;
})();
// Create the server and UI

ww2_CreateServer({
    port: 0, // 0 for auto-assign
    uiConfig: {
        width: 800,
        height: 400,
        title: "Ww2 UI",
        wclassname: "myuiclass",
        isDebug: true,
        isKiosk: false,
        isMaximize: false,
    },
    onExpressCreate: (app) => {
        // You can add custom express middlewares here
    },
    htmlfolder: htmlFolder
});
// Close splash screen if active
closeSplash();

```



------------------------------
## Browser Integration (Client-side)
Once the server is running, you can interact with the native Windows layer using callWw2.

```ts

import { callWw2 } from "win_webview2/browser"
// Open File Dialog 
const openFile = async () => {
    let r = await callWw2({
        openFileDialog: {
            filter: "All Files (*.*)|*.*",
            ownerClassName: "myuiclass",
        }
    });
    console.log("Selected file:", r.result);
};
// Window Controls (Close, Move, Resize, Max/Min) 
const closeWindow = async () => {
    
    await callWw2({
        controlWindow: {
            controlcmd: "close",
            wndClassName: "myuiclass"
        }
    });
};

const resizeWindow = async () => {
    await callWw2({
        controlWindow: {
            controlcmd: "resize",
            wndClassName: "myuiclass",
            width: 800,
            height: 700
        }
    });
};

```

------------------------------

## Low-Level API
If you need direct access to the native module (.node addon), you can use getModule.

```ts

import { getModule } from "win_webview2/node";
async function runLowLevel() {
    const ww2 = await getModule();
    
    // Manual window control
    ww2.controlWindow({
        wndClassName: "myuiclass",
        controlcmd: "maximize"
    });
}

```



## Module Interfaces

```ts

export interface WW2ControlWindowsArg {
    wndClassName: string;
    controlcmd: "close" | "move" | "maximize" | "minimize" | "resize" | "check";
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

```

------------------------------
## License
MIT

