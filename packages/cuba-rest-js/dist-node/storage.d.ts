export declare class DefaultStorage implements Storage {
    private items;
    readonly length: number;
    clear(): void;
    getItem(key: string): string | any;
    key(index: number): string | any;
    removeItem(key: string): void;
    setItem(key: string, data: string): void;
    [key: string]: any;
    [index: number]: string;
}
