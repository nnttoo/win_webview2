import { Ww2WebConfig } from "./downloadModule";
export interface JsonMsg {
    funName: string;
    data: string;
    replyFun: string;
}
export declare function runVirtualDir(config: Omit<Ww2WebConfig, "onVirtualHostRequested" | "url" | "virtualHostName"> & {
    mapFunction: {
        [key: string]: (msg: string) => Promise<string>;
    };
    htmlFolderPath: string;
}): void;
