export type OpenWebArg = {
    url: string;
    width: number;
    height: number;
    kiosk: boolean;
    maximize: boolean;
    title: string;
    isDebugMode: boolean;
    winClassName: string;
};
export type OpenDialogFileArg = {
    winClassName: string;
    filter: string;
};
export type OpenDialogArg = {
    winClassName: string;
};
export declare function openWeb(arg: OpenWebArg): Promise<void>;
export declare function openDialogFile(arg: OpenDialogFileArg): Promise<unknown>;
export declare function openDialogFolder(arg: OpenDialogArg): Promise<unknown>;
export declare function closeWindowWebView(arg: OpenDialogArg): Promise<unknown>;
