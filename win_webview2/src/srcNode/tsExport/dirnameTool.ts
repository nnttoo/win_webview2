import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';
import { existsSync } from 'node:fs';


/**
 * 
 * Penting!! jangan pindah file ini ketempat lain,
 * Sesuaikan ulang jika file ini dipindah karena ini menggunakan __dirname
 * dan juga file ini akan ditranspile ke js ke folder Dist, posisi file ini terhadap root antara file ts dan
 * file js harus sama,
 * 
 */
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
 