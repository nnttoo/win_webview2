import { Ww2WebConfig } from "../downloadModule";
export declare function runVirtualDir(config: Omit<Ww2WebConfig, "onVirtualHostRequested" | "url" | "virtualHostName"> & {
    mapFunction: {
        [key: string]: (msg: object) => Promise<object>;
    };
    htmlFolderPath: string;
}): void;
