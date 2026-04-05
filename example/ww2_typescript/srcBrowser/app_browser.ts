//@ts-check
import { callWw2 } from "win_webview2/browser"

(() => {

    function btn(selector: string) {
        return document.querySelector(selector) as HTMLButtonElement;
    }
    function ipt(selector: string) {
        return btn(selector) as HTMLInputElement;
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


})();