import { spawn } from "child_process";

export function execProg(str: string) {
    const parts = str.split(" ");
    const cmd = parts.shift()!;
    const args = parts;

    const child = spawn(cmd, args, {
        shell: true // penting untuk perintah seperti npm, git, dll
    });

    child.stdout.on("data", (data) => {
        process.stdout.write(data); // realtime output
    });

    child.stderr.on("data", (data) => {
        process.stderr.write(data); // realtime error
    });

    child.on("close", (code) => {
        if (code === 0) {
            console.log("\n✅ Build selesai");
        } else {
            console.log(`\n❌ Proses keluar dengan kode: ${code}`);
        }
    });
}