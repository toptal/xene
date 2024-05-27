import { Bot } from './bot';
import { Dialog } from './dialog';
import { UserMessage } from './types';
export type Matcher = (message: UserMessage) => boolean;
export type AnyMatcher = string | RegExp | Matcher;
export declare class Binder<B extends Bot> {
    private _bot;
    private _matcher;
    static for<T extends Bot>(bot: T): (matcher: AnyMatcher) => Binder<T>;
    constructor(_bot: B, _matcher: AnyMatcher);
    say(message: B['_']['BotMessage']): B;
    do(handler: (message: UserMessage, bot: B) => any): B;
    talk(handler: (dialog: Dialog<B>, bot: B) => any): B;
}
