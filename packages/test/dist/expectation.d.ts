import { Bot } from '@xene/core';
import { BotContext } from './bot-context';
export type On<B extends Bot> = (message: string, channel?: string, user?: string) => Expectation<B>;
export declare class Expectation<B extends Bot> {
    private _context;
    private _message;
    private _channel;
    private _user;
    static create: <B_1 extends Bot<any>, C extends BotContext<Bot<any>>>(context: C) => On<B_1>;
    private constructor();
    says(message: B['_']['BotMessage'], channel?: string): Promise<boolean>;
}
