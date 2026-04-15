import { Ww2WebConfig } from "./downloadModule";
export interface JsonMsg {
    funName: string;
    data: string;
    replyFun: string;
}
export declare function runVirtualDir(config: Omit<Ww2WebConfig, "onPostMessage" | "url" | "virtualHostNameToFolderMapping"> & {
    mapFunction: {
        [key: string]: (msg: string) => Promise<string>;
    };
    virtualHostNameToFolderMapping: string;
}): void;
