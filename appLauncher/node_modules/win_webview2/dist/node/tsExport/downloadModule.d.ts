import { WwvPlatFrom } from "./ww2_config";
interface ResourceRequest {
    uri: string;
    method: string;
    body: Uint8Array;
}
interface ResourceResponse {
    status: number;
    contentType: string;
    body: Uint8Array;
}
export interface Ww2WebConfig {
    onClose: (err: any, data: any) => void;
    wclassname: string;
    url: string;
    title: string;
    width: number;
    height: number;
    isKiosk: boolean;
    isMaximize: boolean;
    isDebug: boolean;
    virtualHostName?: string;
    onVirtualHostRequested?: (req: ResourceRequest, reply: (res: ResourceResponse) => void) => void;
}
interface WW2FileDialogArg {
    callback: (err: any, data: any) => void;
    filter: string;
    ownerClassName: string;
}
export interface WW2ControlWindowsArg {
    wndClassName: string;
    controlcmd: "close" | "move" | "maximize" | "minimize" | "resize" | "check";
    left?: number;
    top?: number;
    height?: number;
    width?: number;
}
export interface Ww2Module {
    openWeb: (arg: Ww2WebConfig) => void;
    openFileDialog: (arg: WW2FileDialogArg) => void;
    openFolderDialog: (arg: WW2FileDialogArg) => void;
    controlWindow: (arg: WW2ControlWindowsArg) => void;
}
export declare function downloadModuleAndExtract(platform: WwvPlatFrom): Promise<void>;
export declare function getModule(): Promise<Ww2Module>;
export {};
