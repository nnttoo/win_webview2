import { OpenDialogFileArg, OpenWebArg } from "./argtype";

 
/**
 * Open WebView window via IPC
 */
export function openWeb(arg: OpenWebArg): void;

/**
 * Open file dialog and return selected file path
 */
export function openDialogFile(arg: OpenDialogFileArg): Promise<string>;

/**
 * Open folder dialog and return selected folder path
 */
export function openDialogFolder(): Promise<string>;
 