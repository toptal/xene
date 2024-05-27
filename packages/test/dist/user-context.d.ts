import { Bot } from '@xene/core';
export declare class UserContext<B extends Bot = Bot> {
    private _subject;
    constructor(_subject: B);
    says(text: any, channel?: any, user?: any): void;
}
