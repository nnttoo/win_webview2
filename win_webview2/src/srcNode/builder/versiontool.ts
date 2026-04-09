import path from "node:path";
import {   getWWVNodeModuleFolder } from "../tsExport/dirnameTool";
import { readFile } from "node:fs/promises";


/** Ini hanya bisa dipakai dengan cara tidak bundle
karena package json mungkin gak ada
 */
export async function  getWWvVersion(){
    let result = "";
    
    try {
        let wwvModulePath = getWWVNodeModuleFolder(); 
        let jsonPath = path.join(wwvModulePath,"package.json");
        let jsontxt = await readFile(jsonPath,"utf-8");
        let jsonObj = JSON.parse(jsontxt) as {  version : string};

        result = jsonObj.version;
        
    } catch (error) {
        console.log(error);
    }

    return result;
}
 