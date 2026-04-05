//@ts-check
 

const fs = require("fs/promises");
const path = require("path");

/**
 * 
 * @param {string} source 
 * @param {string} destination 
 */
async function copyDir(
  source,
  destination 
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

module.exports = {copyDir};
 