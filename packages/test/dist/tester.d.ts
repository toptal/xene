import { Bot } from '@xene/core';
import { UserContext } from './user-context';
import { BotContext } from './bot-context';
export declare class Tester<B extends Bot> {
    private _subject;
    bot: BotContext<B>;
    user: UserContext<B>;
    constructor(_subject: B);
}
