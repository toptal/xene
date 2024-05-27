export type Cb<T> = (message: T) => any;
export type Off = On;
export type On = {
    (event: 'message', cb: Cb<{
        text: string;
        ts: string;
        user: string;
        channel: string;
    }>): void;
    (event: string, cb: Cb<any>): void;
};
