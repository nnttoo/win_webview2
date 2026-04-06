import express from 'express';
import { WW2ControlWindowsArg } from './winwebview2';
interface WW2FileDialogArg {
    filter: string;
    ownerClassName: string;
}
export type PostData = {
    openWeb?: {
        wclassname: string;
        url: string;
        title: string;
        width: number;
        height: number;
        isKiosk: boolean;
        isMaximize: boolean;
        isDebug: boolean;
    };
    openFileDialog?: WW2FileDialogArg;
    openFolderDialog?: WW2FileDialogArg;
    controlWindow?: WW2ControlWindowsArg;
};
export declare function ww2_CreateServer(arg: {
    port: number;
    onExpressCreate: (app: express.Express) => void;
    uiConfig: {
        wclassname: string;
        title: string;
        width: number;
        height: number;
        isKiosk: boolean;
        isMaximize: boolean;
        isDebug: boolean;
    };
    htmlfolder: string;
}): Promise<void>;
export {};
