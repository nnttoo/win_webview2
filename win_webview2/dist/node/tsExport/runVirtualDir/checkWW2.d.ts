import { Ww2Module } from "../downloadModule";
import { InternalFunctionResultPromise } from "./util";
export declare function checkWw2BrowserFunction(arg: {
    path: string;
    method: string;
    body: Uint8Array;
    ww2Module: Ww2Module;
}): InternalFunctionResultPromise;
