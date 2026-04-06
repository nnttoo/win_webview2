import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';
import { existsSync } from 'node:fs';

 

function findUserProjectRootRecrusive(currentDir : string = process.cwd()) { 

    const packagePath = path.join(currentDir, 'package.json'); 
    if (existsSync(packagePath)) {
        return currentDir;
    } 
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
        return null;
    } 
    return findUserProjectRootRecrusive(parentDir);
}

export function findUserProjectRoot() { 

    // - Deployed Condition 
    const packagePath = path.join(path.dirname(process.execPath), 'package.json'); 
    if (existsSync(packagePath)) {
        return path.dirname(packagePath);
    }  
    return findUserProjectRootRecrusive(process.cwd());
}

export function getWWVNodeModuleFolder(){
    let userRootProject = findUserProjectRoot();
    if(userRootProject == null) throw "root project user not found";

    let nodeModuleFolder = path.join(userRootProject,"node_modules/win_webview2");
    return nodeModuleFolder;
}