import { Bot } from '@xene/core';
export declare class BotContext<B extends Bot = Bot> {
    private _subject;
    on: import("./expectation").On<B>;
    messages: {
        channel: string;
        message: B['_']['BotMessage'];
    }[];
    private _expects;
    constructor(_subject: B);
    get lastMessage(): {
        channel: string;
        message: B["_"]["BotMessage"];
    };
    said(message: B['_']['BotMessage'], channel?: string): boolean;
    reset(): void;
    private _check;
    private _prepareNext;
}
