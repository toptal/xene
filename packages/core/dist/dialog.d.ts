import { Bot as B } from './bot';
import { UserMessage, ParseFun, ParseObj } from './types';
export declare class Dialog<Bot extends B, BotMessage extends Bot['_']['BotMessage'] = Bot['_']['BotMessage']> {
    bot: Bot;
    users: string[];
    channel: string;
    isPaused: boolean;
    get user(): string;
    constructor(bot: Bot, channel: string, users: string[]);
    on(event: 'end', callback: () => any): any;
    on(event: 'abort', callback: () => any): any;
    on(event: 'pause', callback: () => any): any;
    on(event: 'unpause', callback: () => any): any;
    on(event: 'incomingMessage', callback: (message: UserMessage) => any): any;
    on(event: 'outgoingMessage', callback: (channel: string, message: BotMessage) => any): any;
    end(): void;
    pause(message: BotMessage): void;
    say(message: BotMessage, unpause?: boolean): Promise<any>;
    parse<T>(parserFunc: ParseFun<T>): Promise<T>;
    parse<T>(parserFunc: ParseFun<T>, errorMessage: BotMessage): Promise<T>;
    parse<T>(parserFunc: ParseFun<T>, errorCallback: (reply: string) => any): Promise<T>;
    parse<T>(parserObject: ParseObj<T>, errorMessage: BotMessage): Promise<T>;
    parse<T>(parserObject: ParseObj<T>, errorCallback: (reply: string) => any): Promise<T>;
    ask<T>(message: BotMessage, parserFunc: ParseFun<T>): Promise<T>;
    ask<T>(message: BotMessage, parserFunc: ParseFun<T>, errorMessage: BotMessage): Promise<T>;
    ask<T>(message: BotMessage, parserFunc: ParseFun<T>, errorCallback: (reply: string) => any): Promise<T>;
    ask<T>(message: BotMessage, parserObject: ParseObj<T>): Promise<T>;
    ask<T>(message: BotMessage, parserObject: ParseObj<T>, errorMessage: BotMessage): Promise<T>;
    ask<T>(message: BotMessage, parserObject: ParseObj<T>, errorCallback: (reply: string) => any): Promise<T>;
}
