interface ChoiseItem {
    fun: () => any;
    description: string;
}
export type WW2Choise = {
    [key: string]: ChoiseItem;
};
export declare function buildForServer(): Promise<void>;
export {};
