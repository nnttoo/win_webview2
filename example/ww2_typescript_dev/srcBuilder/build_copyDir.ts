import { promises as fs } from "fs";
import path from "path"; 



export async function copyDir(
  source: string,
  destination: string
) {



  // pastikan folder tujuan ada
  await fs.mkdir(destination, { recursive: true });

  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    let srcPath = path.join(source, entry.name);
    let destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      // rekursif ke subfolder
      await copyDir(srcPath, destPath);
    } else {

      await fs.copyFile(srcPath, destPath);
    }
  }
}

 