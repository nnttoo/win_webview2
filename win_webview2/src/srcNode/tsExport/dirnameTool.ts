import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';
import { existsSync } from 'node:fs';


export function getWw2Dirname() {
    // Trik deteksi lingkungan
    const _filename = typeof __filename !== 'undefined'
        ? __filename
         // @ts-ignore:
        : fileURLToPath(eval('import.meta.url'));

    const _dirname = typeof __dirname !== 'undefined'
        ? __dirname
        : dirname(_filename);

    let ww2ModulePath = path.join(_dirname,"../../../")

    return { _dirname, _filename , ww2ModulePath};
}

export function findUserProjectRoot(currentDir : string = process.cwd()) { 

    const packagePath = path.join(currentDir, 'package.json'); 
    if (existsSync(packagePath)) {
        return currentDir;
    } 
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
        return null;
    } 
    return findUserProjectRoot(parentDir);
}
 