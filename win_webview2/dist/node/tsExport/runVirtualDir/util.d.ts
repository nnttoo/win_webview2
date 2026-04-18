export declare function byteArrayFromString(txt: string): Uint8Array<ArrayBuffer>;
export declare function byteArrayToString(body: Uint8Array): string;
export declare function getContentType(url: string): string;
export interface InternalFunctionResult {
    content: Uint8Array;
    contentType: string;
}
export type InternalFunctionResultPromise = Promise<InternalFunctionResult | null>;
