import { InternalFunctionResultPromise } from "./util";
export declare function checkMapFunction(arg: {
    mapfunction: {
        [key: string]: (msg: object) => Promise<object>;
    };
    body: Uint8Array;
    method: string;
    path: string;
}): InternalFunctionResultPromise;
