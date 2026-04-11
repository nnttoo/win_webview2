import AdmZip from 'adm-zip';
import path from 'path';

const createZipFromSource = (sourceDir: string, outputFile: string): void => {
    try {
        const zip = new AdmZip();

        // Menambahkan folder ke dalam ZIP
        // Argumen kedua adalah zipPath (folder di dalam ZIP-nya nanti)
        // Kalau dikosongkan "", isi folder langsung ada di root ZIP
        zip.addLocalFolder(sourceDir, "");

        // Simpan secara sinkron
        zip.writeZip(outputFile);

        console.log(`Successfully created ${outputFile} from ${sourceDir}`);
    } catch (error) {
        console.error("Gagal membuat ZIP:", error);
    }
};


export  function createZip() { 
    let winLibPath = path.join(__dirname, "../win_lib");
    let x64Path = path.join(winLibPath,"x64");
    createZipFromSource(
        path.join(winLibPath,"x64"),
        path.join(winLibPath,"x64.zip")
    );
 
    createZipFromSource(
        path.join(winLibPath,"x86"),
        path.join(winLibPath,"x86.zip")
    );
} 