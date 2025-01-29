# Win Webview2  

## npm install

```npm i win_webview2```

Win Webview2 is a GUI toolkit for building desktop applications with Node.js. It is similar to Electron but significantly smaller because Win Webview2 utilizes Microsoft WebView2, which is already installed on Windows 10 and later versions.  

## Building the Application  

Run the following command:  

```sh
npx ww2_builder
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