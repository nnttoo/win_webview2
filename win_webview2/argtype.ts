

export type OpenWebArg = {
    url: string
    width: number 
    height: number
    kiosk: boolean 
    maximize: boolean
    title: string 
    isDebugMode : boolean
    winClassName : string
}

export type OpenDialogFileArg = { 
    winClassName : string
    filter : string
}


export type OpenDialogArg = { 
    winClassName : string 
}