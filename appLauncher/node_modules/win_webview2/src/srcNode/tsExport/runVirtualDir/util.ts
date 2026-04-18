export function byteArrayFromString(txt: string) {
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(txt);
    return uint8Array;
}

export  function byteArrayToString(body: Uint8Array) {
    const decoder = new TextDecoder('utf-8');
    const str = decoder.decode(body);
    return str;
}

const mimeTypes: { [k: string]: string } = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.zip': 'application/zip'
};

export function getContentType(url: string) {
    const ext = url.substring(url.lastIndexOf('.')).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

export interface InternalFunctionResult {
    content: Uint8Array,
    contentType: string
}

export type InternalFunctionResultPromise = Promise<InternalFunctionResult | null>;