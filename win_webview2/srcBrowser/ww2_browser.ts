interface WW2FileDialogArg {
    filter: string;
    ownerClassName: string;
}
interface WW2ControlWindowsArg {
    wndClassName: string;
    controlcmd: "close" | "move" | "maximize" | "minimize" | "resize" | "check",
    left?: number;
    top?: number;
    height?: number;
    width?: number;
}

export type PostData = {
    openWeb?: {
        wclassname: string,
        url: string,
        title: string,

        width: number,
        height: number,
        isKiosk: boolean,
        isMaximize: boolean,
        isDebug: boolean,
    },
    openFileDialog?: WW2FileDialogArg,
    openFolderDialog?: WW2FileDialogArg,
    controlWindow?: WW2ControlWindowsArg,
}

export async function callWw2(arg : PostData){
    let response = await fetch("/ww2_post",{
        method : "POST",
        body : JSON.stringify(arg),
    });

    let result = await response.json() as {
        err : string,
        result : string,
    }

    return result;
    
}