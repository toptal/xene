export type CB = (...args: any[]) => any;
export declare class EventEmitter {
    private _subscribers;
    on: (event: string, cb: CB) => void;
    emit: (event: string, ...args: any[]) => void;
}
