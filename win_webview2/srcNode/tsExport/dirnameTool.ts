import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';


export function getDirname() {
    // Trik deteksi lingkungan
    const _filename = typeof __filename !== 'undefined'
        ? __filename
         // @ts-ignore:
        : fileURLToPath(eval('import.meta.url'));

    const _dirname = typeof __dirname !== 'undefined'
        ? __dirname
        : dirname(_filename);

    return { _dirname, _filename };
}
