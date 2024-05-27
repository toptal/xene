export declare class Resolvable<T> {
    reject: (error?: Error | any) => void;
    resolve: (arg: T) => void;
    promise: Promise<T>;
    constructor();
}
