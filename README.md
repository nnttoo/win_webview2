# Win Webview2  

## npm install

```npm i win_webview2```


Win Webview2 is a GUI toolkit for building desktop applications with Node.js. It is similar to Electron but significantly smaller because Win Webview2 utilizes Microsoft WebView2, which is already installed on Windows 10 and later versions.  

## Building the Application  

Run the following command:  

```sh
npx win_webview2
```  

A menu will appear in the terminal with the following options:  
- `init_webview2` – Creates a configuration file in JSON format.  
- `deploy` – Builds the application from your Node.js project.  

## Example Configuration File  

```json
{
  "entry_point": "app.js",
  "appname": "openweb",
  "icon_path": "./icon.png",
  "outdir": "./dist"
}
```

## Open Webview Frome Node

```js
import { openDialogFile, openDialogFolder, openWeb } from 'win_webview2';

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

```

look at github examples folder for detail