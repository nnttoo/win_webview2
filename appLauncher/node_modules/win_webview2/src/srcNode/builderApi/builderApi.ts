import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { getWWVNodeModuleFolder } from "../tsExport/dirnameTool";
import sharp from "sharp";
import { sharpsToIco } from "sharp-ico";
import * as PELibrary from 'pe-library';
import * as ResEdit from 'resedit';

async function createDir(dirpath: string) {
    if (!existsSync(dirpath)) {
        try {

            await mkdir(dirpath, { recursive: true });
        } catch (error) {

        }
    }
}

async function createIcoFile(arg: {
    pngPath: string,
    icoPath: string
}) {
    let iconPath = arg.pngPath;
    if (!existsSync(iconPath)) {
        console.log("icon not found");
        return;
    }

    let outputIcon = arg.icoPath;

    const sizes = [16, 32, 48, 256]; // Ukuran standar untuk rcedit
    const images = await Promise.all(sizes.map(size =>
        sharp(iconPath)
            .resize(size, size)
            .toFormat('png')
    ));


    await sharpsToIco(images, outputIcon);
}

export async function createLauncher(arg: {
    iconPath: string,
    splashPath: string,
    outPath: string,
    platform: string,
    script : string,
}) {

    if (arg.platform == null) {
        arg.platform = "x64";
    }

    let exeTempPath = arg.outPath + '.temp.exe';
    let exeReal = arg.outPath;

    let outDirPath = path.dirname(arg.outPath);
    await createDir(outDirPath);

    let wwvPath = getWWVNodeModuleFolder();
    await (async () => {
        console.log("copy launcer");
        let launcerPath = path.join(wwvPath, "win_lib/" + arg.platform + "/appLauncher.exe");
        await copyFile(launcerPath, exeTempPath);
    })();


    console.log("copy splash file");
    await copyFile(
        arg.splashPath,
        path.join(outDirPath, "splash.png")
    );

    await (async () => {
        console.log("create ico file");
        let icoPath = path.join(outDirPath, "icon.ico");

        await createIcoFile({
            pngPath: arg.iconPath,
            icoPath: icoPath
        });


        console.log("edit file icon");

        let iconBin = await readFile(icoPath);
        const iconFile = ResEdit.Data.IconFile.from(iconBin);

        let exeData = await readFile(exeTempPath);
        let exe = PELibrary.NtExecutable.from(exeData);
        let res = PELibrary.NtExecutableResource.from(exe);


        ResEdit.Resource.IconGroupEntry.replaceIconsForResource(
            res.entries,
            101,          // ID Icon Group yang mau diganti (biasanya 101 atau 1)
            1033,         // Language ID
            iconFile.icons.map((item) => item.data) // Mengambil data biner dari tiap ukuran icon
        );

        const myScript = arg.script;
        const scriptUint8 = new TextEncoder().encode(myScript);

        const scriptEntry = {
            type: 10,       // RT_RCDATA
            id: 'MY_SCRIPT', // Gunakan 'id' sesuai hasil print kamu
            lang: 1033,
            codepage: 0,
            bin: scriptUint8.buffer // Ambil ArrayBuffer-nya
        };

        res.entries.push(scriptEntry);
        res.outputResource(exe);
        const newBinary = exe.generate();
        await writeFile(exeReal, Buffer.from(newBinary));

        await rm(exeTempPath)
    })();




}