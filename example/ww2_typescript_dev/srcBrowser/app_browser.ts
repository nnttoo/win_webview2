//@ts-check
import { callVirtualDirFunction, callWw2 } from "win_webview2/browser"

(() => {

    function btn(selector: string) {
        return document.querySelector(selector) as HTMLButtonElement;
    }
    function ipt(selector: string) {
        return btn(selector) as any as HTMLInputElement;
    }

    btn("#openfdialog").onclick = async () => {
        let r = await callWw2({
            openFileDialog: {
                filter: "",
                ownerClassName: "test",
            }
        });

        ipt("#ipt_dialog").value = r.result;
    };

    btn("#openfolder").onclick = async () => {
        let r = await callWw2({
            openFolderDialog: {
                filter: "",
                ownerClassName: "test"
            }
        });

        ipt("#ipt_dialog_folder").value = r.result;
    };

    btn("#close").onclick = async () => {
        await callWw2({
            controlWindow: {
                controlcmd: "close",
                wndClassName: "myuiclass"
            }
        })
    };

    btn("#move").onclick = async () => {
        await callWw2({
            controlWindow: {
                controlcmd: "move",
                wndClassName: "myuiclass",
                left: 100,
                top: 0
            }
        })
    }

    btn("#resize").onclick = async () => {
        await callWw2({
            controlWindow: {
                controlcmd: "resize",
                wndClassName: "myuiclass",
                width: 800,
                height: 700
            }
        })
    }

    btn("#max").onclick = async () => {
        await callWw2({
            controlWindow: {
                controlcmd: "maximize",
                wndClassName: "myuiclass",
            }
        })
    }

    btn("#min").onclick = async () => {
        await callWw2({
            controlWindow: {
                controlcmd: "minimize",
                wndClassName: "myuiclass",
            }
        })
    }

    btn("#testcamera").onclick = async () => {
        const video = document.querySelector("#videoElement") as HTMLVideoElement;
        let stream: MediaStream;
        video.style.display = "block";
        video.onclick = () => {
            const tracks = stream.getTracks();

            tracks.forEach(track => {
                track.stop(); // Ini yang benar-benar mematikan sensor hardware
            });
            video.srcObject = null;
            video.style.display = "none";
        }

        // Cek apakah browser mendukung mediaDevices
        if (navigator.mediaDevices.getUserMedia) {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
            } catch (error) {
                console.error("Gagal mengakses kamera: ", error);
                alert("Kamera tidak diizinkan atau tidak ditemukan.");
            }
        } else {
            alert("Browser kamu tidak mendukung akses kamera.");
        }
    }


    btn("#testget").onclick = async () => {
        let result = await callVirtualDirFunction("getTest", "ini darai bwoser");
        console.log(result);
    }


})();