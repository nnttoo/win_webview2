

export type OpenWebArg = {
    url: string
    width: number 
    height: number
    kiosk: boolean 
    maximize: boolean
    title: string 
    isDebugMode : boolean
}

export type OpenDialogFileArg = {
    filter : string
}