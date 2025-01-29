#!/usr/bin/env node

// @ts-check

import prompts from "prompts";
import fs from 'fs'
const jsonConfigFilePath = "./win_webview2.json";

/** @typedef {import("./ww2_builder_type").ConfigWW2} ConfigWW2 */

/**
 * 
 * @param {string} msg 
 * @param {string[]} list 
 * @returns {Promise<string>}
 */
async function askWhitList(msg, list) {
  let p = await prompts([
    {
      type: 'select', // Tipe pertanyaan list (menu dropdown)
      name: 'hasilnya',
      message: msg,
      choices: list.map((val) => {
        let r = {
          title: val,
          value: val
        }
        return r
      }), // Opsi
    },
  ]);
  return p.hasilnya;
}

function logPrint(msg) {
  console.log(new Date().toLocaleString() + ": ", msg);
}

async function deploy() {

  logPrint("Deploy win_webview2");

  /**
   * 
   * @returns { Promise<ConfigWW2> }
   */
  let readConfig = async () => {
    let str = await fs.promises.readFile(jsonConfigFilePath);
    let jsonObj = JSON.parse(str.toString());

    return jsonObj;
  }

  let config = await readConfig();

  let buildIcon = () => {
    let iconPath = config.icon_path;
    if (!fs.existsSync(iconPath)) {
      logPrint("icon notfound");
      return;
    } 
  }

  let makeDistFolder = async()=>{
    let folderDist = config.outdir;
    if(!fs.existsSync(folderDist)){
      await fs.promises.mkdir(folderDist);
    }
  }

  await makeDistFolder()
  await buildIcon();
}

async function initWebview2() {


  /** @type {ConfigWW2} */

  let objConfig = {
    entry_point: "./dist/app.js",
    appname: "openweb",
    icon_path: "./icon.png",
    outdir : "./dist"
  }

  let objstr = JSON.stringify(objConfig, null, 2);
  await fs.promises.writeFile(jsonConfigFilePath, objstr);

}

async function run() {
  let p = await askWhitList("menu", [
    "init_webview2",
    "deploy",
    "back",
    "exit"
  ]);

  if (p == "init_webview2") {

    await initWebview2();

  } else if (p == "deploy") {
    await deploy();

  }



  if (p == "exit") {
    return;
  }

  run();
}


run();