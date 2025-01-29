#!/usr/bin/env node

// @ts-check

import prompts from "prompts";
import fs from 'fs'
import sharp from "sharp"
import path from "path";
import { logPrint } from "./ww2_builder_log.mjs";
import { WW2Deploy } from "./ww2_builder_deploy.mjs";


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




 

 

async function run() {
    let p = await askWhitList("menu", [
        "init_webview2",
        "deploy",
        "back",
        "exit"
    ]);

    if (p == "init_webview2") {

        await WW2Deploy.initWW2();

    } else if (p == "deploy") {
        await WW2Deploy.startDeploy(); 
    }



    if (p == "exit") {
        return;
    }

    run();
}


run();