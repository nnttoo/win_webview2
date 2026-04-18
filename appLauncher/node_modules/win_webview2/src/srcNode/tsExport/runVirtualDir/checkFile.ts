import { existsSync } from "node:fs";
import { getContentType, InternalFunctionResultPromise } from "./util";
import path from "node:path";
import { readFile } from "node:fs/promises";

export async function checkFileFromVirtualFolder(htmlFolderPath: string, currentPath: string): InternalFunctionResultPromise {
    let contentType = getContentType(currentPath);
    let filePath = path.join(htmlFolderPath, currentPath);

    if (!existsSync(filePath)) {
        return null;
    }

    let fileContent = await readFile(filePath);
    let uint8 = new Uint8Array(fileContent);

    return {
        content: uint8,
        contentType
    }
}